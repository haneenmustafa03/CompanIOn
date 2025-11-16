import { spawn } from "child_process";
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../../ML/asr and llm/uploads");
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "recording-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// POST /api/chatbot/process-audio
router.post("/process-audio", upload.single("audio"), async (req, res) => {
  let uploadedFilePath = null;
  let responseSent = false;

  // Helper function to send response only once
  const sendResponse = (statusCode, data) => {
    if (!responseSent) {
      responseSent = true;
      res.status(statusCode).json(data);
    }
  };

  try {
    if (!req.file) {
      console.log("❌ No audio file in request");
      console.log("Request body:", req.body);
      console.log("Request files:", req.files);
      return res.status(400).json({
        success: false,
        message: "No audio file provided",
      });
    }

    uploadedFilePath = req.file.path;
    console.log("📥 Received audio file:", uploadedFilePath);
    console.log("File details:", {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    // Path to Python script
    const pythonScriptPath = path.join(
      __dirname,
      "../../ML/asr and llm/main.py"
    );

    // Check if Python script exists
    if (!fs.existsSync(pythonScriptPath)) {
      throw new Error(`Python script not found at: ${pythonScriptPath}`);
    }

    // Run Python script
    console.log("🐍 Running Python script:", pythonScriptPath);
    console.log("🐍 With audio file:", uploadedFilePath);

    const pythonProcess = spawn("python3", [
      pythonScriptPath,
      uploadedFilePath,
    ]);

    let pythonOutput = "";
    let pythonError = "";

    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
      console.log("Python stdout:", data.toString());
    });

    pythonProcess.stderr.on("data", (data) => {
      pythonError += data.toString();
      console.error("Python stderr:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);

      // Clean up uploaded audio file
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlink(uploadedFilePath, (err) => {
          if (err) console.error("Error deleting audio file:", err);
          else console.log("🗑️ Cleaned up uploaded audio file");
        });
      }

      if (code !== 0) {
        // Check if it's a missing module error
        const isMissingModule =
          pythonError.includes("ModuleNotFoundError") ||
          pythonError.includes("No module named");

        // Check if it's a missing ffmpeg error
        const isMissingFFmpeg =
          pythonError.includes("ffmpeg was not found") ||
          pythonError.includes("No such file or directory: 'ffmpeg'") ||
          (pythonError.includes("FileNotFoundError") &&
            pythonError.includes("ffmpeg"));

        // Check if it's an Ollama connection error
        const isOllamaConnectionError =
          (pythonError.includes("Connection refused") &&
            (pythonError.includes("localhost") ||
              pythonError.includes("11434"))) ||
          (pythonError.includes("ConnectionError") &&
            pythonError.includes("11434"));

        let errorMessage = "Python script failed";
        if (isMissingModule) {
          const requirementsPath = path.join(
            __dirname,
            "../../ML/asr and llm/requirements.txt"
          );
          errorMessage =
            'Python dependencies are missing. Please install them by running: pip3 install -r "' +
            requirementsPath +
            '"';
        } else if (isMissingFFmpeg) {
          errorMessage =
            "ffmpeg is not installed but is required for audio processing. " +
            "On macOS, install it with: brew install ffmpeg";
        } else if (isOllamaConnectionError) {
          errorMessage =
            "Ollama is not running. The LLM service needs to be started. " +
            "Please start Ollama by running: ollama serve " +
            "(or start the Ollama application if installed via the app). " +
            "Make sure Ollama is running on http://localhost:11434";
        }

        return sendResponse(500, {
          success: false,
          message: errorMessage,
          error: pythonError,
          output: pythonOutput,
        });
      }

      // Parse Python output to extract result
      const resultMatch = pythonOutput.match(
        /RESULT:\s*TEXT:\s*(.*?)\s*AUDIO_FILE:\s*(.*?)\s*-{50}/s
      );

      if (!resultMatch) {
        return sendResponse(500, {
          success: false,
          message: "Failed to parse Python output",
          rawOutput: pythonOutput,
        });
      }

      const responseText = resultMatch[1].trim();
      const ttsAudioFilePath = resultMatch[2].trim();

      console.log("✅ Text response:", responseText);
      console.log("🔊 Audio file:", ttsAudioFilePath);

      // Check if audio file exists
      if (ttsAudioFilePath === "None" || !fs.existsSync(ttsAudioFilePath)) {
        return sendResponse(200, {
          success: true,
          text: responseText,
          audioFile: null,
          message: "Response generated but no TTS audio available",
        });
      }

      // Read the audio file and send it back
      const audioBuffer = fs.readFileSync(ttsAudioFilePath);
      const audioBase64 = audioBuffer.toString("base64");
      const audioExtension = path.extname(ttsAudioFilePath).toLowerCase();
      const mimeType = audioExtension === ".mp3" ? "audio/mpeg" : "audio/wav";

      // Clean up TTS file after reading (optional - comment out if you want to keep them)
      // fs.unlink(ttsAudioFilePath, (err) => {
      //   if (err) console.error('Error deleting TTS file:', err);
      // });

      sendResponse(200, {
        success: true,
        text: responseText,
        audioFile: audioBase64,
        audioMimeType: mimeType,
        message: "Audio processed successfully",
      });
    });

    pythonProcess.on("error", (err) => {
      console.error("❌ Failed to start Python process:", err);

      // Clean up uploaded file
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }

      sendResponse(500, {
        success: false,
        message: "Failed to start Python process",
        error: err.message,
      });
    });
  } catch (error) {
    console.error("❌ Error processing audio:", error);
    console.error("Error stack:", error.stack);

    // Clean up uploaded file on error
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
        console.log("🗑️ Cleaned up uploaded file after error");
      } catch (unlinkErr) {
        console.error("Error deleting audio file:", unlinkErr);
      }
    }

    res.status(500).json({
      success: false,
      message: "Error processing audio",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

export default router;

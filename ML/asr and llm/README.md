# Companion AI — Voice Conversation System 🎤🤖

## What This Does (Simple Explanation)

This program lets you have a **voice conversation** with a friendly AI companion designed for autistic teens. Here's how it works:

1. **🎤 You speak** → Record your voice and save it as an audio file (like `audio1.mp3`)
2. **👂 AI listens** → The program converts your speech to text (speech recognition)
3. **🧠 AI thinks** → A smart chatbot reads what you said and comes up with a helpful, friendly response
4. **🗣️ AI responds** → The response is converted back to speech with a natural-sounding voice
5. **💾 AI remembers** → All conversations are saved so the AI can remember what you talked about

### Key Features:
- ✅ **Natural conversations** - The AI remembers previous chats and builds on them
- ✅ **Autism-friendly responses** - Clear, literal language with short sentences
- ✅ **Human-like voice** - Uses Google's text-to-speech for natural sound (not robotic!)
- ✅ **Privacy-focused** - Everything runs on your computer (except voice generation)
- ✅ **Conversation memory** - The AI remembers past topics to build continuity

---

## What You Need (Prerequisites)

### Required Software:
1. **Python** (version 3.10, 3.11, or 3.12)
   - This is the programming language that runs the code
   - Download from: https://www.python.org/downloads/

2. **FFmpeg** (audio processing tool)
   - Helps convert and process audio files
   - Windows installation: Open PowerShell and run:
     ```bash
     winget install Gyan.FFmpeg
     ```
   - Then restart your terminal/PowerShell

3. **Ollama** (local AI chatbot)
   - This runs the AI brain that generates responses
   - Windows installation: Open PowerShell and run:
     ```bash
     winget install Ollama.Ollama
     ```
   - After installation, download the AI model:
     ```bash
     ollama pull llama3.2:3b
     ```

---

## Installation (One-Time Setup)

### Step 1: Install Python Libraries

Open PowerShell or Command Prompt and run **ONE** of these commands:

#### ⭐ **Recommended** (Natural Voice):
```bash
pip install "transformers[audio]" torch torchaudio soundfile numpy requests gtts
```
This gives you a **natural-sounding Google voice** - much better than robotic voices!

#### Basic (Robotic Voice):
```bash
pip install "transformers[audio]" torch torchaudio soundfile numpy requests pyttsx3
```
This works offline but sounds robotic.

#### Advanced (High-Quality Offline):
```bash
pip install "transformers[audio]" torch torchaudio soundfile numpy requests TTS
```
Neural network voices that sound very natural and work offline (but slower).

---

## How to Use

### Basic Usage:
```bash
python main.py your_audio_file.mp3
```

Replace `your_audio_file.mp3` with the path to your recorded audio file.

### Example:
```bash
python main.py audio1.mp3
```

### What Happens:
1. The program transcribes your speech to text
2. The AI reads it and generates a thoughtful response
3. The response is saved as both text and an audio file
4. The conversation is saved to memory for future reference

### Output:
- **Text response** printed in the terminal
- **Audio file** saved in `tts_output/response_YYYYMMDD_HHMMSS.mp3`
- **Conversation history** saved in `conversation_history.json`

---

## Utility Commands

### View Conversation Statistics:
```bash
python main.py --show-stats
```
Shows how many conversations you've had, when they happened, etc.

### Clear Conversation Memory:
```bash
python main.py --clear-history
```
Erases all saved conversations (fresh start).

### Clear Audio Files:
```bash
python main.py --clear-tts
```
Deletes all generated audio response files to free up space.

---

## How the AI Companion Behaves

The AI is designed specifically for autistic teens with these principles:

- **Clear Communication**: Short sentences, one idea at a time, literal language
- **Empathy First**: Acknowledges feelings before anything else
- **User Control**: Asks what you want (listen, ideas, distraction, or games)
- **Consistent Tone**: Calm, steady, no sarcasm or idioms
- **Safe Space**: Won't diagnose or give medical advice, offers to contact trusted adults if worried
- **Memory**: Remembers previous conversations to build continuity

---

## File Structure

```
📁 ML/asr and llm/
├── 📄 main.py                      # Main program
├── 📄 README.md                     # This file
├── 📄 conversation_history.json     # Saved conversations (auto-created)
├── 🎵 audio1.mp3, audio2.mp3       # Your audio input files
└── 📁 tts_output/                  # Generated AI voice responses
    └── response_YYYYMMDD_HHMMSS.mp3
```

---

## Troubleshooting

### "No audio file specified" error
Make sure you include the audio file name:
```bash
python main.py your_audio.mp3
```

### "Audio file not found" error
Check that the file exists and the path is correct. If the file is in another folder:
```bash
python main.py "C:/path/to/your/audio.mp3"
```

### Robotic voice instead of natural voice
Make sure you installed `gtts`:
```bash
pip install gtts
```

### "Connection refused" or LLM errors
Make sure Ollama is running. Open a new terminal and start it:
```bash
ollama serve
```

### First run is slow
The first time you run the program, it downloads AI models (~500MB). This is normal and only happens once.

---

## Privacy & Data

- **Conversations**: Saved locally in `conversation_history.json` on your computer
- **Audio files**: Saved locally in `tts_output/` folder
- **Speech recognition**: Runs on your computer (offline)
- **AI responses**: Generated locally by Ollama (offline)
- **Voice generation (gTTS)**: Requires internet, sends text to Google (not audio recordings)

Your actual voice recordings are **never uploaded** - only the text version is sent to generate the spoken response.

---

## Questions or Issues?

If something isn't working:
1. Make sure all prerequisites are installed (Python, FFmpeg, Ollama)
2. Check that Ollama is running (`ollama serve`)
3. Verify you have an internet connection (for gTTS voice generation)
4. Make sure the audio file exists and is in a supported format (mp3, wav, etc.)

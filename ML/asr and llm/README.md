# Companion — Local ASR + LLM

This folder runs speech-to-text (ASR) with `transformers` and chats with a **local** LLM via **Ollama**.

## Prereqs
- **Python** 3.10–3.12 (3.13 can break torchaudio)
- **ffmpeg** on PATH  
  - Windows: `winget install Gyan.FFmpeg` (then restart terminal)
- **Ollama** installed and running
  - Windows: `winget install Ollama.Ollama`
  - Pull model once: `ollama pull llama3.2:3b`

## Install (one-time)
```bash
pip install "transformers[audio]" torch torchaudio soundfile numpy requests pyttsx3
```

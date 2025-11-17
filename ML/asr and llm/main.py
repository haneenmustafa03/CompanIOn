from transformers import pipeline
import requests, json, sys, os, argparse
from datetime import datetime

# Configuration
HISTORY_FILE = "conversation_history.json"
TTS_OUTPUT_DIR = "tts_output"

def initialize_tts():
    """Initialize the TTS engine (gTTS preferred, falls back to pyttsx3)"""
    
    # Try gTTS first - natural sounding voice
    try:
        from gtts import gTTS
        print("Using gTTS (Google Text-to-Speech) engine")
        return {'engine': 'gtts'}
    except ImportError:
        print("gTTS not installed. Install with: pip install gtts")
        print("Falling back to pyttsx3...")
    
    # Fallback: pyttsx3 (robotic but works offline)
    try:
        import pyttsx3
        engine = pyttsx3.init('sapi5')
        
        voices = engine.getProperty('voices')
        if voices:
            print(f"Using pyttsx3 with {len(voices)} available voices")
            for voice in voices:
                voice_name = voice.name.lower() if voice.name else ""
                if any(name in voice_name for name in ['female', 'zira', 'hazel', 'eva', 'helena']):
                    engine.setProperty('voice', voice.id)
                    print(f"Selected voice: {voice.name}")
                    break
            else:
                print(f"Using default voice: {voices[0].name if voices[0].name else 'Unknown'}")
        
        engine.setProperty('rate', 160)
        engine.setProperty('volume', 0.95)
        
        return {'engine': 'pyttsx3', 'model': engine}
    except Exception as e:
        print(f"Warning: Could not initialize any TTS engine: {e}")
        return None

def generate_tts_file(text, engine_config=None):
    """Generate TTS audio file from text using configured engine"""
    if engine_config is None:
        return None
    
    try:
        os.makedirs(TTS_OUTPUT_DIR, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = os.path.join(TTS_OUTPUT_DIR, f"response_{timestamp}.wav")
        
        engine_type = engine_config.get('engine')
        
        if engine_type == 'gtts':
            # Google TTS - natural sounding voice
            from gtts import gTTS
            tts = gTTS(text=text, lang='en', slow=False, tld='com')
            # gTTS produces mp3, convert filename
            filename = filename.replace('.wav', '.mp3')
            tts.save(filename)
            print(f"[OK] TTS audio saved (gTTS): {filename}")
            
        elif engine_type == 'pyttsx3':
            # pyttsx3 - offline but robotic
            model = engine_config.get('model')
            model.save_to_file(text, filename)
            model.runAndWait()
            print(f"[OK] TTS audio saved (pyttsx3): {filename}")
        
        return filename
            
    except Exception as e:
        print(f"TTS Error: {e}")
        return None

def load_conversation_history():
    """Load previous conversation history from JSON file"""
    if not os.path.exists(HISTORY_FILE):
        return []
    
    try:
        with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
            history = json.load(f)
            # Return only the messages, not the metadata
            return history.get('messages', [])
    except (json.JSONDecodeError, FileNotFoundError):
        print("Warning: Could not load conversation history. Starting fresh.")
        return []

def save_conversation_exchange(user_message, assistant_response):
    """Save the current conversation exchange to history"""
    # Load existing history
    history_data = {"messages": [], "last_updated": None}
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
                history_data = json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            pass
    
    # Add new exchange
    history_data["messages"].extend([
        {"role": "user", "content": user_message},
        {"role": "assistant", "content": assistant_response}
    ])
    history_data["last_updated"] = datetime.now().isoformat()
    
    # Save back to file
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(history_data, f, indent=2, ensure_ascii=False)
    
    print(f"Conversation saved. Total exchanges: {len(history_data['messages'])//2}")

def clear_conversation_history():
    """Clear all conversation history"""
    if os.path.exists(HISTORY_FILE):
        os.remove(HISTORY_FILE)
        print("Conversation history cleared!")
    else:
        print("No conversation history to clear.")

def clear_tts_output():
    """Remove all files in the TTS output directory"""
    if not os.path.exists(TTS_OUTPUT_DIR):
        print("No TTS output directory found.")
        return

    removed = 0
    for fname in os.listdir(TTS_OUTPUT_DIR):
        path = os.path.join(TTS_OUTPUT_DIR, fname)
        try:
            if os.path.isfile(path):
                os.remove(path)
                removed += 1
        except Exception as e:
            print(f"Failed to remove {path}: {e}")

    print(f"Cleared {removed} files from {TTS_OUTPUT_DIR}")

def show_conversation_stats():
    """Show statistics about conversation history"""
    if not os.path.exists(HISTORY_FILE):
        print("No conversation history found.")
        return
    
    try:
        with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
            history_data = json.load(f)
            messages = history_data.get('messages', [])
            last_updated = history_data.get('last_updated', 'Unknown')
            
            user_messages = len([msg for msg in messages if msg['role'] == 'user'])
            print("Conversation Statistics:")
            print(f"  Total exchanges: {user_messages}")
            print(f"  Total messages: {len(messages)}")
            print(f"  Last updated: {last_updated}")
            print(f"  Memory file size: {os.path.getsize(HISTORY_FILE)} bytes")
    except (json.JSONDecodeError, FileNotFoundError):
        print("Could not read conversation history.")

# Parse command line arguments
parser = argparse.ArgumentParser(description='Companion ASR + LLM with Memory')
parser.add_argument('--clear-history', action='store_true', help='Clear conversation history and exit')
parser.add_argument('--show-stats', action='store_true', help='Show conversation statistics and exit')
parser.add_argument('--clear-tts', action='store_true', help='Clear saved TTS audio files and exit')
parser.add_argument('--audio-file', type=str, dest='audio_file_flag', help='Path to audio file to process')
parser.add_argument('audio_file_pos', nargs='?', help='Audio file to process (positional argument)')
args = parser.parse_args()

# Handle utility commands (these exit after completion)
if args.clear_history:
    clear_conversation_history()
    sys.exit(0)

if args.show_stats:
    show_conversation_stats()
    sys.exit(0)

if args.clear_tts:
    clear_tts_output()
    sys.exit(0)

# Initialize TTS engine (we will always save TTS audio files for frontend use)
print("Initializing text-to-speech...")
tts_engine = initialize_tts()
if tts_engine:
    print("TTS engine ready")
else:
    print("TTS engine failed to initialize - continuing without TTS")

# Retrieve optional lesson metadata passed from Node server
lesson_context = None
lesson_data_env = os.environ.get("LESSON_DATA", "").strip()
if lesson_data_env:
    try:
        lesson_context = json.loads(lesson_data_env)
        print("Lesson metadata received:", lesson_context)
    except json.JSONDecodeError as e:
        print("Warning: Could not parse LESSON_DATA:", e)

# Determine audio file to process
if args.audio_file_flag:  # --audio-file flag used
    audio_file = args.audio_file_flag
elif args.audio_file_pos:  # positional argument used  
    audio_file = args.audio_file_pos
else:
    # No audio file provided - require user to specify one
    print("Error: No audio file specified.")
    print("Please provide an audio file to process:")
    print("  python main.py --audio-file path/to/audio.mp3")
    print("  python main.py path/to/audio.mp3")
    print()
    print("Other commands:")
    print("  python main.py --show-stats     (view conversation statistics)")
    print("  python main.py --clear-history  (clear conversation history)")
    print("  python main.py --clear-tts      (clear saved TTS audio files)")
    sys.exit(1)

# Validate audio file exists
if not os.path.exists(audio_file):
    print(f"Error: Audio file '{audio_file}' not found.")
    print("Please check the file path and try again:")
    print("  python main.py --audio-file path/to/audio.mp3")
    print("  python main.py path/to/audio.mp3")
    print("  python main.py --no-tts path/to/audio.mp3    (without TTS)")
    print("  python main.py --play-tts path/to/audio.mp3  (save + play TTS)")
    sys.exit(1)

# ASR
print("Processing audio...")
print(f"Using audio file: {audio_file}")
asr = pipeline("automatic-speech-recognition")
res = asr(audio_file)
transcript = res.get("text", "").strip()
if not transcript:
    print("No transcript produced.")
    sys.exit(1)

print(f"Transcript: {transcript}")

# LLM
print("Loading conversation history...")
previous_conversations = load_conversation_history()
print(f"Found {len(previous_conversations)} previous messages")

MODEL = "llama3.2:3b"
persona = """You are “Companion,” a friendly chat buddy for autistic teens.
Communication: Use clear, literal language. Short sentences. One idea at a time. One question max per message. Prefer A/B/C choices. Offer to slow down or pause.
Empathy: Acknowledge feelings first and reflect back in simple words.
Autonomy: Ask what the user prefers (listen, ideas, distraction, or a game). Ask permission before giving advice or changing topics.
Consistency: Keep a steady, calm tone. Avoid idioms, sarcasm, and jokes.
Interests: Invite and engage with special interests. Celebrate small wins.
Safety: You are not a clinician—do not diagnose or give medical advice. If the user expresses intent to harm themselves or others, say: “I’m worried about your safety.” Offer to contact a trusted adult.
Constraints: Keep replies 1–3 sentences. If giving steps, list up to three. End with an optional single question or a simple choice, unless the user asks for no questions.
Memory: You remember our previous conversations. Reference past topics when relevant to build continuity."""

# Build messages with conversation history
messages = [
    {"role": "system", "content": persona},
]

if lesson_context:
    lesson_details = []
    if lesson_context.get("lessonName"):
        lesson_details.append(f"Name: {lesson_context['lessonName']}")
    if lesson_context.get("lessonDescription"):
        lesson_details.append(f"Description: {lesson_context['lessonDescription']}")
    if lesson_context.get("lessonSkills"):
        lesson_details.append(
            "Skills: " + ", ".join(map(str, lesson_context["lessonSkills"]))
        )
    if lesson_context.get("lessonDifficulty"):
        lesson_details.append(f"Difficulty: {lesson_context['lessonDifficulty']}")
    if lesson_context.get("lessonCategory"):
        lesson_details.append(f"Category: {lesson_context['lessonCategory']}")

    lesson_context_message = "Lesson context for this conversation:\n" + "\n".join(
        f"- {detail}" for detail in lesson_details
    )
    messages.append({"role": "system", "content": lesson_context_message})

messages.extend(previous_conversations)  # Include all previous conversation history
messages.append({"role": "user", "content": transcript})

print(f"Sending {len(messages)} messages to LLM (including history)...")

r = requests.post(
    "http://localhost:11434/api/chat",
    json={"model": MODEL, "messages": messages, "options": {"num_predict": 120, "temperature": 0.7}},
    stream=True,
    timeout=120,
)

reply_chunks = []
for line in r.iter_lines(decode_unicode=True):
    if not line:
        continue
    data = json.loads(line)
    msg = data.get("message", {})
    if "content" in msg:
        reply_chunks.append(msg["content"])
    if data.get("done"):
        break

reply = "".join(reply_chunks).strip()

# Save this conversation exchange
print("Saving conversation...")
save_conversation_exchange(transcript, reply)

print("\n" + "="*50)
print("Companion Response:")
print(reply)
print("="*50)

# Text-to-speech output
tts_filename = None
if tts_engine:
    print("\nGenerating TTS audio (saved to file)...")
    # Always save TTS to file by default for frontend integration
    tts_filename = generate_tts_file(reply, tts_engine)

# Output structured result for frontend integration
print("\n" + "-"*50)
print("RESULT:")
print(f"TEXT: {reply}")
if tts_filename:
    # Convert to absolute path for frontend
    abs_tts_path = os.path.abspath(tts_filename)
    print(f"AUDIO_FILE: {abs_tts_path}")
else:
    print("AUDIO_FILE: None")
print("-"*50)

print("\nConversation complete.")

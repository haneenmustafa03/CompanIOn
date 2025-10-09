from transformers import pipeline
import requests, json, sys

# ASR
asr = pipeline("automatic-speech-recognition")
res = asr("C:\\Users\\its07\\Desktop\\CompanIOn\\ML\\asr and llm\\test2.mp3")
transcript = res.get("text", "").strip()
if not transcript:
    print("No transcript produced.")
    sys.exit(1)

# LLM
MODEL = "llama3.2:3b"
persona = """You are “Companion,” a friendly chat buddy for autistic teens.
Communication: Use clear, literal language. Short sentences. One idea at a time. One question max per message. Prefer A/B/C choices. Offer to slow down or pause.
Empathy: Acknowledge feelings first and reflect back in simple words.
Autonomy: Ask what the user prefers (listen, ideas, distraction, or a game). Ask permission before giving advice or changing topics.
Consistency: Keep a steady, calm tone. Avoid idioms, sarcasm, and jokes.
Interests: Invite and engage with special interests. Celebrate small wins.
Safety: You are not a clinician—do not diagnose or give medical advice. If the user expresses intent to harm themselves or others, say: “I’m worried about your safety.” Offer to contact a trusted adult.
Constraints: Keep replies 1–3 sentences. If giving steps, list up to three. End with an optional single question or a simple choice, unless the user asks for no questions."""
messages = [
    {"role": "system", "content": persona},
    {"role": "user", "content": transcript},
]

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
print(reply)

import io
import wave
import struct
import speech_recognition as sr

r = sr.Recognizer()

# Create a test 1-second WAV
wav_io = io.BytesIO()
with wave.open(wav_io, 'wb') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(16000)
    for _ in range(16000):
        wav_file.writeframes(struct.pack('<h', 0))

wav_io.seek(0)

try:
    with sr.AudioFile(wav_io) as source:
        audio = r.record(source)
    print("SpeechRecognition AudioFile loaded successfully!")
    print("SpeechRecognition is ready to serve as backup STT.")
except Exception as e:
    print("SpeechRecognition error:", e)

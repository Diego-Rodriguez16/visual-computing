import speech_recognition as sr
import pyttsx3
from pythonosc import udp_client

# ---- OSC CONFIGURATION ----
OSC_IP = "127.0.0.1"
OSC_PORT = 12000   # Receiver port in Processing
client = udp_client.SimpleUDPClient(OSC_IP, OSC_PORT)

# ---- VOICE ----
engine = pyttsx3.init()
engine.setProperty('rate', 170)

def hablar(texto):
    print(">>", texto)
    engine.say(texto)
    engine.runAndWait()

# ---- COMMANDS ----
comandos = {
    "adelante": "/adelante",
    "atrás": "/atras",
    "izquierda": "/izquierda",
    "derecha": "/derecha",
    "detener": "/detener"
}

# ---- RECOGNITION ----
r = sr.Recognizer()
with sr.Microphone() as source:
    hablar("Voice control system activated.")
    while True:
        print("\nListening...")
        audio = r.listen(source)

        try:
            texto = r.recognize_google(audio, language="es-ES")
            print(f"Command detected: {texto}")

            enviado = False
            for palabra, ruta in comandos.items():
                if palabra in texto.lower():
                    client.send_message(ruta, 1)
                    hablar(f"Executing command {palabra}")
                    enviado = True
                    break

            if not enviado:
                hablar("I did not recognize that command.")

        except sr.UnknownValueError:
            print("Audio not understood.")
        except Exception as e:
            print("Error:", e)

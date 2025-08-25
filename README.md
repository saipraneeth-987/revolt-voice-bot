# 🎤 Revolt Motors Voice Assistant (Gemini Live API)

A real-time conversational **voice assistant** built with **Node.js, Express, WebSockets, and Google Gemini API**, replicating the functionality of the official Revolt Motors chatbot.

This project demonstrates:
- 🔊 Voice input (speech-to-text via browser)  
- 🗣️ AI voice output (multilingual TTS via Google Translate proxy)  
- 🧠 Conversation memory (keeps track of context across turns)  
- ✂️ Interruption handling (Stop button cancels AI mid-speech)  
- ⚡ Low latency (~1–2s between user input and AI response)  
- 🌍 Multilingual support (English, Hindi, Telugu, Tamil, Kannada, etc.)  

---

## 🚀 Features

- Natural conversation flow – AI remembers context from earlier turns.  
- Multilingual answers – If you ask “Explain RV400 in Hindi/Telugu/etc.” it replies in that language **and speaks it out correctly**.  
- User interruption – Stop button cancels both AI speech and listening.  
- Server-to-server architecture – Frontend connects only to your backend; backend securely talks to Gemini API.  
- Minimal UI – Just `Start Talking` and `Stop` buttons, as required.  

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, WebSocket (`ws`), dotenv  
- **Frontend**: HTML, JavaScript (browser speech recognition + audio playback)  
- **AI**: Google Gemini API (`gemini-1.5-flash`)  
- **TTS**: Google Translate TTS proxy (via server)  

---

## 📂 Project Structure

```plaintext
revolt-voice-bot/
│
├── server.js          # Node.js backend (Gemini API + WebSocket + TTS proxy)
├── package.json
├── .env               # Environment variables (NOT pushed to GitHub)
├── .env.example       # Example environment file for evaluators
├── public/
│   └── index.html     # Frontend (speech recognition, WebSocket client)
└── README.md
```

---

## ⚙️ Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/saipraneeth-987/revolt-voice-bot.git
cd revolt-voice-bot
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**


* Open `.env` and paste your Google Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
```

> Get a free API key from [Google AI Studio](https://aistudio.google.com/).

4. **Run the server**

```bash
npm start
```

The server will start at:  
👉 [http://localhost:3000](http://localhost:3000)

5. **Open the frontend**

* Visit [http://localhost:3000](http://localhost:3000) in Chrome.  
* Click **Start Talking** → speak into mic.  
* AI replies and **speaks back** in the requested language.  

---


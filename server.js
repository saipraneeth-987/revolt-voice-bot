import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ No Gemini API Key found. Add it in .env file");
  process.exit(1);
}

console.log("Gemini API Key Loaded: ✅ Yes");

// Serve frontend files
app.use(express.static("public"));

/**
 * Gemini text chat with conversation memory
 */
async function askGemini(history) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text:
                  "You are Rev, the official Revolt Motors assistant. " +
                  "Always follow the user's language instructions: if they say 'in Hindi/Telugu/Tamil/…', reply fully in that language. " +
                  "Otherwise reply in the language the question was asked. " +
                  "Only talk about Revolt motorcycles, services, features, or pricing."
              }
            ]
          },
          contents: history
        })
      }
    );

    const data = await response.json();
    console.log("🔍 Gemini raw response:", JSON.stringify(data, null, 2));

    if (data.candidates && data.candidates.length > 0) {
      const parts = data.candidates[0].content.parts;
      if (parts && parts.length > 0 && parts[0].text) {
        return parts[0].text;
      }
    }

    if (data.error) {
      console.error("❌ Gemini API Error:", data.error);
      return "Sorry, Gemini API error: " + data.error.message;
    }

    return "⚠️ No response text found in Gemini output.";
  } catch (err) {
    console.error("❌ Error calling Gemini:", err);
    return "Error: Could not reach Gemini API.";
  }
}

/**
 * WebSocket: per-connection memory + replies
 */
wss.on("connection", (ws) => {
  console.log("🔗 Client connected");
  let history = [];

  ws.on("message", async (message) => {
    const userMessage = message.toString();
    console.log("💬 User:", userMessage);

    // Keep conversation history for context
    history.push({ role: "user", parts: [{ text: userMessage }] });

    const reply = await askGemini(history);

    // Save AI reply in history
    history.push({ role: "model", parts: [{ text: reply }] });

    ws.send(JSON.stringify({ type: "ai", text: reply }));
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected, clearing history");
    history = [];
  });
});

/**
 * 🔊 TTS proxy endpoint
 * Streams audio from Google Translate TTS to avoid CORS/voice availability issues.
 * Supports short text; client will chunk longer replies automatically.
 */
app.get("/tts", async (req, res) => {
  try {
    const text = (req.query.text || "").toString();
    const lang = (req.query.lang || "en").toString();

    if (!text) return res.status(400).send("Missing text");
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text
    )}&tl=${encodeURIComponent(lang)}&client=tw-ob`;

    const r = await fetch(ttsUrl, {
      headers: {
        // A user agent is required by Google TTS endpoint
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!r.ok) {
      console.error("❌ TTS fetch failed:", r.status, r.statusText);
      return res.status(502).send("TTS upstream error");
    }

    const arrayBuf = await r.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.send(Buffer.from(arrayBuf));
  } catch (e) {
    console.error("❌ /tts error:", e);
    res.status(500).send("TTS error");
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

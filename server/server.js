import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Check API Key
if (!process.env.GROQ_API_KEY) {
  console.log("❌ GROQ_API_KEY not found in .env");
  process.exit(1);
}

console.log("✅ GROQ API Key Loaded");

// Create Groq Client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Test Route
app.get("/", (req, res) => {
  res.send("Groq AI Backend Running 🚀");
});

// Chat Route
app.post("/chat", async (req, res) => {

  console.log("=================================");
  console.log("BODY RECEIVED:", req.body);
  console.log("MESSAGE:", req.body.message);
  console.log("=================================");

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    // Keep all the rest of your existing code unchanged...

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant for a textile marketplace. Help users with fabrics, suppliers, prices, and product recommendations.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0].message.content;

    res.json({
      reply,
      recommended_product_ids: [],
    });

  } catch (error) {
    console.error("❌ GROQ ERROR");
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
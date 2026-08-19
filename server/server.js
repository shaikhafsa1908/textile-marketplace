import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

if (!process.env.GROQ_API_KEY) {
  console.error("GROQ_API_KEY is missing. Check your .env file.");
  process.exit(1);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    message: "Warp Textile AI backend is running!",
  });
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    console.log("User message:", message);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are Warp, an expert AI textile sourcing assistant.

Help users with:
- Fabric recommendations
- Comparing fabrics
- Textile sourcing
- Weaves and fabric construction
- Fabric care
- Materials for specific use cases
- Summer shirting fabrics
- Textile manufacturing
- Fiber properties

Give practical, accurate, concise answers.`,
        },
        {
          role: "user",
          content: message,
        },
      ],

      model: "openai/gpt-oss-20b",
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    console.log("Warp response generated successfully.");

    res.status(200).json({
      reply,
    });

  } catch (error) {

    console.error("================================");
    console.error("        GROQ API ERROR");
    console.error("================================");

    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Code:", error.code);

    if (error.response) {
      console.error("Response:", error.response);
    }

    console.error("================================");

    res.status(500).json({
      error: error.message || "Groq API request failed",
    });
  }
});

app.listen(PORT, () => {
  console.log("--------------------------------");
  console.log(`Warp Backend: http://localhost:${PORT}`);
  console.log("Groq AI: Connected");
  console.log("--------------------------------");
});

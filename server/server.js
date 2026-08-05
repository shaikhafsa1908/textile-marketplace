import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert AI textile sourcing assistant. Recommend fabrics, suppliers, compare products, explain GSM, weave, and textile quality.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
 } catch (err) {
  console.error("OpenAI Error:", err);

  res.status(500).json({
    reply: err.message || "Something went wrong.",
  });
}
});

app.listen(3001, () => {
  console.log("✅ AI Server running on http://localhost:3001");
});
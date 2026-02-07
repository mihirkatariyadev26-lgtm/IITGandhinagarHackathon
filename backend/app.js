import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is missing or invalid in .env file.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  console.log("Received prompt:", prompt);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini Response:", text);
    res.send(text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;
  console.log("Received image prompt:", prompt);

  try {
    let finalPrompt = prompt;

    // STEP 1: Enhance Prompt with Gemini
    try {
      console.log("Enhancing prompt with Gemini...");
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const enhancementPrompt = `Rewrite the following prompt to be highly detailed, descriptive, and optimized for an AI image generator (Flux/Stable Diffusion). Focus on lighting, texture, and composition. Return ONLY the enhanced prompt, nothing else.\n\nOriginal Prompt: "${prompt}"`;

      const result = await model.generateContent(enhancementPrompt);
      const enhancedText = result.response.text().trim();

      if (enhancedText) {
        console.log("Enhanced Prompt:", enhancedText);
        finalPrompt = enhancedText;
      }
    } catch (geminiError) {
      console.warn(
        "Prompt Enhancement Failed (using original):",
        geminiError.message,
      );
    }

    // STRATEGY 1: Hugging Face (Flux.1-schnell) - SOTA Quality
    console.log("Attempting Hugging Face (Flux)...");
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: finalPrompt }),
      },
    );

    if (response.ok) {
      console.log("Hugging Face Success!");
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.setHeader("Content-Type", "image/jpeg");
      res.send(buffer);
      return;
    } else {
      console.log(
        "Hugging Face Failed:",
        response.status,
        await response.text(),
      );
    }

    // STRATEGY 2: Fallback to Pollinations
    console.log("Falling back to Pollinations...");
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

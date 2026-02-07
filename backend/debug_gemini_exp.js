import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testImage() {
  // Trying the experimental model which might have different quota
  const modelName = "models/gemini-2.0-flash-exp-image-generation";
  console.log(`Testing Image Gen with ${modelName}...`);

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("A futuristic city");
    const response = await result.response;

    console.log("Response received.");

    if (response.candidates && response.candidates[0].content.parts) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData) {
          console.log(
            "SUCCESS! Image data received. MimeType:",
            part.inlineData.mimeType,
          );
          console.log("Data length:", part.inlineData.data.length);
          return;
        }
      }
    }
    console.log("No image data found.");
    console.log(response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testImage();

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testImage() {
  const modelName = "gemini-2.5-flash-image"; // Found in models.json
  console.log(`Testing Image Gen with ${modelName}...`);

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("A futuristic city");
    const response = await result.response;

    console.log("Response received.");
    // console.log(JSON.stringify(response, null, 2));

    // Check for inline data (images)
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
    console.log("No image data found in response.");
    console.log(response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testImage();

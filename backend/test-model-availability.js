require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTest = [
    "gemini-flash-latest",
    "gemini-2.0-flash-lite-preview-09-2025",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.0-pro",
    "gemini-2.0-flash-exp",
    "gemini-pro",
  ];

  console.log("Testing with API Key ending in...", apiKey.slice(-4));

  for (const modelName of modelsToTest) {
    console.log(`\nTesting model: ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });

    try {
      const result = await model.generateContent("Hello?");
      const response = await result.response;
      const text = response.text();
      console.log(`✅ Success with ${modelName}:`, text);
      return; // Stop after first success
    } catch (error) {
      console.log(`❌ Failed with ${modelName}: ${error.message}`);
      if (error.response) {
        console.log("Response status:", error.response.status);
        console.log("Response data:", JSON.stringify(error.response.data));
      }
    }
  }
  console.log("\n❌ All models failed.");
}

testModel();

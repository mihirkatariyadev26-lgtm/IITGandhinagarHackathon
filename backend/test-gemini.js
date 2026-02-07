require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const CaptionGenerator = require("./services/ai/captionGenerator");
const WebsiteAnalyzer = require("./services/ai/websiteAnalyzer");
const fs = require("fs");

async function testGemini() {
  console.log("🚀 Testing Gemini Integration...");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // 1. Test Caption Generation
  console.log("\n📝 Testing Caption Generation...");
  const captionGen = new CaptionGenerator(genAI);
  // Hack: temporarily override model in the instance if possible, or just rely on what's in the file
  // Actually, I should update the file `captionGenerator.js` to use the model I want to test.
  // But here I'm running the service as is.
  // So I must update `captionGenerator.js` FIRST.

  try {
    const result = await captionGen.generateCaption(
      "A delicious cup of coffee in a cozy cafe",
      { brandTone: "warm and inviting", businessType: "Cafe" },
      "instagram",
    );
    console.log("✅ Caption Generated:");
    console.log(`"${result.caption}"`);
    console.log("Hashtags:", result.hashtags.join(" "));
  } catch (error) {
    console.error("❌ Caption Generation Failed:", error.message);
  }

  // 2. Test Website Analysis (Vision)
  console.log("\n👁️ Testing Website Analysis (Vision)...");
  const analyzer = new WebsiteAnalyzer(genAI);

  // Create a 1x1 pixel PNG for testing
  const dummyImage = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64",
  );

  try {
    const result = await analyzer.analyzeBrandWithAI(dummyImage, {
      title: "Test Cafe",
      metaDescription: "Best coffee in town",
      content: "We serve specialty coffee and fresh pastries.",
    });
    console.log("✅ Vision Analysis Successful:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Vision Analysis Failed:", error.message);
  }
}

testGemini();

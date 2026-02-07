require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("API Key missing");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  console.log(`Testing model: ${modelName}...`);
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello!");
    const response = await result.response;
    console.log(`✅ ${modelName} works! Response: ${response.text()}`);
    return true;
  } catch (error) {
    console.error(`❌ ${modelName} failed: ${error.message}`);
    return false;
  }
}

async function run() {
  const models = [
    "gemini-2.0-flash",
    "models/gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-pro",
  ];

  for (const model of models) {
    if (await testModel(model)) {
      console.log(`\n🎉 Recommended model is: ${model}`);
      break;
    }
  }
}

run();

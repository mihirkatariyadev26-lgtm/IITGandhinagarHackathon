require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing in .env");
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const models = response.data.models;
    console.log("✅ Available Models:");
    const names = models.map((m) => m.name).join("\n");
    fs.writeFileSync("model_names.txt", names);
    console.log("Written to model_names.txt");
  } catch (error) {
    console.error("❌ Failed to list models:");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
  }
}

listModels();

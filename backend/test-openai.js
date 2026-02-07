require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  try {
    console.log("Testing OpenAI API key...");
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A simple white square",
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });
    console.log("Success! Image URL:", response.data[0].url);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

test();

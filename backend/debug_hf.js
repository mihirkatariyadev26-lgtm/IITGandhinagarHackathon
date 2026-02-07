import dotenv from "dotenv";

dotenv.config();

const token = process.env.HUGGING_FACE_TOKEN;

async function testURL(url) {
  console.log("Testing URL:", url);
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      method: "POST",
      body: JSON.stringify({ inputs: "The quick brown fox" }),
    });
    console.log("Status:", response.status, response.statusText);
    if (!response.ok) {
      console.log("Body:", await response.text());
    } else {
      console.log("Success!");
    }
  } catch (e) {
    console.log("Error:", e.message);
  }
  console.log("---");
}

async function run() {
  // Test 1: Old API with GPT2 (standard model)
  await testURL("https://api-inference.huggingface.co/models/gpt2");

  // Test 2: New Router with GPT2
  await testURL("https://router.huggingface.co/models/gpt2");

  // Test 3: New Router with DAMO
  await testURL(
    "https://router.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b",
  );

  // Test 4: New Router with hf-inference prefix
  await testURL(
    "https://router.huggingface.co/hf-inference/models/damo-vilab/text-to-video-ms-1.7b",
  );
}

run();

import dotenv from "dotenv";

dotenv.config();

const token = process.env.HUGGING_FACE_TOKEN;

async function testURL(url, useToken = true) {
  console.log("Testing URL:", url);
  const headers = useToken ? { Authorization: `Bearer ${token}` } : {};
  try {
    const response = await fetch(url, {
      headers,
      method: "POST", // Pollinations uses GET usually, let's try both
      body: JSON.stringify({ inputs: "A cat" }),
    });

    // Pollinations GET check
    if (url.includes("pollinations")) {
      const resp2 = await fetch(url);
      if (resp2.ok) {
        console.log(
          "SUCCESS (Pollinations GET)! Bytes:",
          (await resp2.arrayBuffer()).byteLength,
        );
        return "pollinations-get";
      }
    }

    if (response.ok) {
      console.log(
        "SUCCESS (POST)! Bytes:",
        (await response.arrayBuffer()).byteLength,
      );
      return "api-post";
    } else {
      console.log("Status:", response.status, response.statusText);
      // console.log("Body:", await response.text());
    }
  } catch (e) {
    console.log("Error:", e.message);
  }
}

async function run() {
  // 1. Pollinations (GET)
  await testURL(
    "https://image.pollinations.ai/prompt/A%20futuristic%20city",
    false,
  );

  // 2. HF Stable Diffusion v1-5
  await testURL(
    "https://router.huggingface.co/hf-inference/models/runwayml/stable-diffusion-v1-5",
    true,
  );

  // 3. HF Stable Diffusion v2-1
  await testURL(
    "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-2-1",
    true,
  );

  // 4. HF OpenJourney
  await testURL(
    "https://router.huggingface.co/hf-inference/models/prompthero/openjourney",
    true,
  );

  // 5. HF FLUX.1-dev (might require authentication)
  await testURL(
    "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev",
    true,
  );
}

run();

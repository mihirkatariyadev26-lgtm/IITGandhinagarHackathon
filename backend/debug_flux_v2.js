import dotenv from "dotenv";
dotenv.config();

async function verify() {
  const prompt = "A futuristic city";
  const token = process.env.HUGGING_FACE_TOKEN; // Ensure .env is loaded
  const model = "black-forest-labs/FLUX.1-schnell";

  console.log(`Testing Image Gen with ${model} on ROUTER...`);

  try {
    const url = `https://router.huggingface.co/hf-inference/models/${model}`;
    console.log("URL:", url);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    });

    console.log("Status:", response.status, response.statusText);

    if (response.ok) {
      console.log(
        "SUCCESS! Image bytes received:",
        (await response.arrayBuffer()).byteLength,
      );
    } else {
      const text = await response.text();
      console.log("ERROR Body:", text);
    }
  } catch (error) {
    console.error("Fetch Error:", error.message);
  }
}

verify();

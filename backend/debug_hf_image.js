import dotenv from "dotenv";

dotenv.config();

const token = process.env.HUGGING_FACE_TOKEN;
const url =
  "https://router.huggingface.co/hf-inference/models/runwayml/stable-diffusion-v1-5";

async function verify() {
  console.log("Token:", token ? token.substring(0, 5) + "..." : "MISSING");
  console.log("Testing URL:", url);

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      method: "POST",
      body: JSON.stringify({ inputs: "A cat in space" }),
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
  } catch (e) {
    console.error("Fetch Error:", e.message);
  }
}

verify();

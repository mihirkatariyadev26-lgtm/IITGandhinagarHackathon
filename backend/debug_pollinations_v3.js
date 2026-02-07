async function verify() {
  const prompt = "A futuristic city";
  const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}`;
  console.log("Testing Pollinations URL:", url);

  try {
    const response = await fetch(url);
    console.log("Status:", response.status, response.statusText);
    console.log("Content-Type:", response.headers.get("content-type"));

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      console.log("Bytes:", buffer.byteLength);
      if (buffer.byteLength < 5000) {
        console.log("Body Preview:", new TextDecoder().decode(buffer));
      }
    }
  } catch (e) {
    console.error("Fetch Error:", e.message);
  }
}

verify();

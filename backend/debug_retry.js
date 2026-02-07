async function verify() {
  const prompt = "A futuristic city";
  console.log("Testing Pollinations Retry...");

  for (let i = 0; i < 5; i++) {
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&nologo=true&width=512&height=512`;

    console.log(`Try ${i + 1}: URL:`, url);
    try {
      const response = await fetch(url);
      if (response.ok && response.status === 200) {
        console.log(
          "SUCCESS! Bytes:",
          (await response.arrayBuffer()).byteLength,
        );
      } else {
        console.log("FAILED. Status:", response.status, response.statusText);
      }
    } catch (e) {
      console.error("Fetch Error:", e.message);
    }
    // Wait nicely
    await new Promise((r) => setTimeout(r, 2000));
  }
}

verify();

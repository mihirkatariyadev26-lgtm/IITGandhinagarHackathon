async function verify() {
  const prompt = "A futuristic city";
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  console.log("Testing Pollinations URL:", url);

  try {
    const response = await fetch(url);
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

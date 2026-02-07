async function verify() {
  const prompt = "A futuristic city";
  const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}`;
  console.log("Testing Pollinations URL:", url);

  try {
    const response = await fetch(url, { redirect: "follow" });
    console.log("Status:", response.status, response.statusText);
    console.log("URL:", response.url);

    if (response.ok) {
      console.log("SUCCESS! Bytes:", (await response.arrayBuffer()).byteLength);
    } else {
      const text = await response.text();
      console.log("ERROR Body:", text);
    }
  } catch (e) {
    console.error("Fetch Error:", e.message);
  }
}

verify();

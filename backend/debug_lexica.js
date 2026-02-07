async function verify() {
  const prompt = "A futuristic city";
  const url = `https://lexica.art/api/v1/search?q=${encodeURIComponent(prompt)}`;
  console.log("Testing Lexica URL:", url);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    console.log("Status:", response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log(
        "Success! Images found:",
        data.images ? data.images.length : "0",
      );
      if (data.images && data.images.length > 0) {
        console.log("Example URL:", data.images[0].src);
      }
    } else {
      const text = await response.text();
      console.log("ERROR Body:", text);
    }
  } catch (e) {
    console.error("Fetch Error:", e.message);
  }
}

verify();

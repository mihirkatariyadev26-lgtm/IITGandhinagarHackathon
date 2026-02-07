async function verify() {
  const prompt = "A futuristic city";
  const url = `https://hercai.onrender.com/v3/text2image?prompt=${encodeURIComponent(prompt)}`;
  console.log("Testing Hercai URL:", url);

  try {
    const response = await fetch(url);
    console.log("Status:", response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log("Response Body:", data);
    } else {
      const text = await response.text();
      console.log("ERROR Body:", text);
    }
  } catch (e) {
    console.error("Fetch Error:", e.message);
  }
}

verify();

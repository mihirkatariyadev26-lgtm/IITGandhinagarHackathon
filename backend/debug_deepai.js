async function verify() {
  const prompt = "A futuristic city";
  console.log("Testing DeepAI...");

  try {
    const formData = new FormData();
    formData.append("text", prompt);

    const response = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: { "api-key": "quickstart-QUdJIGlzIGNvbWluZy..." },
      body: formData,
    });

    console.log("Status:", response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log("Success! URL:", data.output_url);
    } else {
      const text = await response.text();
      console.log("ERROR Body:", text);
    }
  } catch (e) {
    console.error("Fetch Error:", e.message);
  }
}

verify();

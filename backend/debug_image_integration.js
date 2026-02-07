async function verify() {
  const prompt = "A futuristic city";
  console.log(
    "Testing POST to http://127.0.0.1:3000/generate-image with prompt:",
    prompt,
  );

  try {
    const response = await fetch("http://127.0.0.1:3000/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
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

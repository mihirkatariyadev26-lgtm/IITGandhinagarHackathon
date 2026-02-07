async function test(url) {
  console.log("Testing:", url);
  try {
    const response = await fetch(url);
    console.log("Status:", response.status, response.statusText);
    if (response.ok) {
      if (url.includes("lexica")) {
        const data = await response.json();
        console.log("Lexica Results:", data.images ? data.images.length : "0");
      } else {
        console.log("ContentType:", response.headers.get("content-type"));
        console.log("Bytes:", (await response.arrayBuffer()).byteLength);
      }
    } else {
      console.log("Body:", await response.text());
    }
  } catch (e) {
    console.log("Error:", e.message);
  }
}

async function run() {
  await test("https://api.airforce/imagine?prompt=A%20futuristic%20city");
  await test(
    "https://api.airforce/v1/imagine?prompt=A%20futuristic%20city&model=flux",
  );
  await test("https://lexica.art/api/v1/search?q=A%20futuristic%20city");
}

run();

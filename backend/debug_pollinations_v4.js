async function test(url) {
  console.log("Testing:", url);
  try {
    const response = await fetch(url);
    console.log("Status:", response.status, response.statusText);
    if (response.ok) {
      console.log("ContentType:", response.headers.get("content-type"));
      console.log("Bytes:", (await response.arrayBuffer()).byteLength);
    }
  } catch (e) {
    console.log("Error:", e.message);
  }
}

async function run() {
  await test("https://image.pollinations.ai/prompt/test");
  await test("https://pollinations.ai/prompt/test");
  await test("https://pollinations.ai/p/test?raw=true"); // maybe raw param?
  await test("https://image.pollinations.ai/p/test");
  await test("https://pollinations.ai/api/imagine?prompt=test");
}

run();

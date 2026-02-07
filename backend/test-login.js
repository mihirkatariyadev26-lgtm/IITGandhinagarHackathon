const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function testLogin() {
  console.log("Starting Login Tests...");

  // Scenario 1: Valid Login
  try {
    console.log("\n1. Testing Valid Login...");
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: "newuser@example.com",
      password: "TestPass123",
    });
    console.log(
      "✅ Success! Token received:",
      res.data.data && res.data.data.token ? "Yes" : "No",
    );
  } catch (error) {
    console.error(
      "❌ Failed:",
      error.response ? error.response.data : error.message,
    );
  }

  // Scenario 2: Invalid Email
  try {
    console.log("\n2. Testing Invalid Email...");
    await axios.post(`${BASE_URL}/auth/login`, {
      email: "wrong@example.com",
      password: "TestPass123",
    });
    console.error("❌ Failed! Should have returned 400/404");
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 400 ||
        error.response.status === 401 ||
        error.response.status === 404)
    ) {
      console.log("✅ Success! Expected error:", error.response.data.message);
    } else {
      console.error("❌ Unexpected error:", error.message);
    }
  }

  // Scenario 3: Invalid Password
  try {
    console.log("\n3. Testing Invalid Password...");
    await axios.post(`${BASE_URL}/auth/login`, {
      email: "newuser@example.com",
      password: "WrongPassword123",
    });
    console.error("❌ Failed! Should have returned 400/401");
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 400 || error.response.status === 401)
    ) {
      console.log("✅ Success! Expected error:", error.response.data.message);
    } else {
      console.error("❌ Unexpected error:", error.message);
    }
  }

  // Scenario 4: Missing Fields
  try {
    console.log("\n4. Testing Missing Password...");
    await axios.post(`${BASE_URL}/auth/login`, {
      email: "newuser@example.com",
    });
    console.error("❌ Failed! Should have returned 400");
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // Check if validation error message is present
      const msg =
        error.response.data.message ||
        (error.response.data.errors
          ? error.response.data.errors[0].msg
          : "Unknown");
      console.log("✅ Success! Expected error:", msg);
    } else {
      console.error("❌ Unexpected error:", error.message);
    }
  }
}

testLogin();

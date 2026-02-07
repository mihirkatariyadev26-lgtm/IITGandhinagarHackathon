const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");
const { validateRegister, validateLogin } = require("../middleware/validation");

// Public routes
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

// Protected routes
router.get("/me", authMiddleware, getMe);

module.exports = router;

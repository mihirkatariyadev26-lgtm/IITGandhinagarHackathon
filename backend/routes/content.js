const express = require("express");
const router = express.Router();
const {
  generateContent,
  getContent,
  updateContent,
  getUserContent,
  deleteContent,
} = require("../controllers/contentController");
const { authMiddleware } = require("../middleware/auth");
const { validateContentGeneration } = require("../middleware/validation");

// All routes are protected
router.post(
  "/generate",
  authMiddleware,
  validateContentGeneration,
  generateContent,
);
router.get("/", authMiddleware, getUserContent);
router.get("/:contentId", authMiddleware, getContent);
router.put("/:contentId", authMiddleware, updateContent);
router.delete("/:contentId", authMiddleware, deleteContent);

module.exports = router;

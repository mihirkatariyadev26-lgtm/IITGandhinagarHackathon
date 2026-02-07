const express = require("express");
const router = express.Router();
const {
  analyzeWebsite,
  getBusinessProfile,
  getUserBusinesses,
} = require("../controllers/businessController");
const { authMiddleware } = require("../middleware/auth");
const { validateWebsiteUrl } = require("../middleware/validation");

// All routes are protected
router.post("/analyze", authMiddleware, validateWebsiteUrl, analyzeWebsite);
router.get("/:businessId", authMiddleware, getBusinessProfile);
router.get("/", authMiddleware, getUserBusinesses);

module.exports = router;

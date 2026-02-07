const express = require("express");
const router = express.Router();
const {
  publishNow,
  getPublishStatus,
} = require("../controllers/publishController");
const { authMiddleware } = require("../middleware/auth");

// All routes are protected
router.post("/now", authMiddleware, publishNow);
router.get("/status/:contentId", authMiddleware, getPublishStatus);

module.exports = router;

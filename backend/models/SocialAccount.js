const mongoose = require("mongoose");

const socialAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    platform: {
      type: String,
      required: true,
      enum: ["instagram", "facebook", "linkedin", "twitter"],
    },
    accountName: {
      type: String,
      required: true,
    },
    accountId: String,
    accessToken: String, // Should be encrypted in production
    refreshToken: String, // Should be encrypted in production
    tokenExpiry: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    permissions: [String],
    lastSync: Date,
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
socialAccountSchema.index({ userId: 1, platform: 1 });

module.exports = mongoose.model("SocialAccount", socialAccountSchema);

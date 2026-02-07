const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Business",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    contentType: {
      type: String,
      enum: ["image", "video", "carousel"],
      default: "image",
    },
    status: {
      type: String,
      enum: ["draft", "generating", "scheduled", "published", "failed"],
      default: "draft",
    },
    mediaUrl: String,
    thumbnailUrl: String,
    caption: String,
    hashtags: [String],
    platforms: [
      {
        type: String,
        enum: ["instagram", "facebook", "linkedin", "twitter"],
      },
    ],
    scheduledFor: Date,
    publishedAt: Date,
    generationMetadata: {
      aiModel: String,
      prompt: String,
      generationTime: Number, // milliseconds
      cost: Number,
    },
    socialMediaIds: {
      instagram: String,
      facebook: String,
      linkedin: String,
      twitter: String,
    },
    analytics: {
      impressions: { type: Number, default: 0 },
      reach: { type: Number, default: 0 },
      engagement: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      lastFetched: Date,
    },
    error: String,
  },
  {
    timestamps: true,
  },
);

// Indexes for faster queries
contentSchema.index({ userId: 1, status: 1 });
contentSchema.index({ businessId: 1 });

module.exports = mongoose.model("Content", contentSchema);

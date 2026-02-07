const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    websiteUrl: {
      type: String,
      required: [true, "Website URL is required"],
      trim: true,
    },
    businessType: {
      type: String,
      trim: true,
    },
    brandProfile: {
      logo: String,
      colorPalette: [
        {
          type: String,
          match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
        },
      ],
      brandTone: {
        type: String,
        enum: ["formal", "casual", "youthful", "professional", "friendly"],
        default: "professional",
      },
      targetAudience: String,
      description: String,
      services: [String],
      keywords: [String],
    },
    lastScraped: Date,
    scrapingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    scrapingError: String,
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
businessSchema.index({ userId: 1 });

module.exports = mongoose.model("Business", businessSchema);

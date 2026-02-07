const Content = require("../models/Content");
const Business = require("../models/Business");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ContentGenerator = require("../services/ai/contentGenerator");
const CaptionGenerator = require("../services/ai/captionGenerator");
const storageService = require("../services/storage/storageService");

// Initialize Gemini and generators
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;
// ContentGenerator still uses mock/null for images as Gemini image gen is not standard here
const contentGenerator = new ContentGenerator(null);
const captionGenerator = new CaptionGenerator(genAI);
const websiteAnalyzer = new WebsiteAnalyzer(genAI);

// @desc    Generate content (image + caption)
// @route    POST /api/content/generate
// @access  Private
exports.generateContent = async (req, res) => {
  try {
    console.log("Generating content request received");
    const { businessId, prompt, platforms, contentType = "image" } = req.body;
    const userId = req.user._id;

    // Verify business belongs to user
    const business = await Business.findOne({ _id: businessId, userId });
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    // Check subscription limits
    if (req.user.subscription.postsRemaining <= 0) {
      return res.status(403).json({
        success: false,
        message:
          "You have reached your monthly post limit. Please upgrade your plan.",
      });
    }

    // Create content record
    const content = await Content.create({
      businessId,
      userId,
      contentType,
      status: "generating",
      platforms: platforms || ["instagram"],
    });

    try {
      const startTime = Date.now();

      // Generate image
      let mediaUrl = null;
      let imageMetadata = {};
      let usedMock = false;

      if (openai) {
        try {
          const imageResult = await contentGenerator.generateImage(
            prompt,
            business.brandProfile,
          );
          // Upload to storage
          mediaUrl = await storageService.uploadImage(
            imageResult.imageBuffer,
            `${content._id}.png`,
          );
          imageMetadata = imageResult.metadata;
        } catch (err) {
          console.warn(
            "OpenAI generation failed, falling back to mock:",
            err.message,
          );
          usedMock = true;
        }
      }

      if (!openai || usedMock) {
        // Use mock generation if no API key or if generation failed
        const mockResult = await contentGenerator.generateMockImage();
        mediaUrl = await storageService.uploadImage(
          mockResult.imageBuffer,
          `${content._id}.png`,
        );
        imageMetadata = mockResult.metadata;
      }

      // Generate caption
      const captionResult = await captionGenerator.generateCaption(
        prompt,
        business.brandProfile,
        platforms[0] || "instagram",
      );

      // Update content
      content.mediaUrl = mediaUrl;
      content.caption = captionResult.caption;
      content.hashtags = captionResult.hashtags;
      content.status = "draft";
      content.generationMetadata = {
        ...imageMetadata,
        prompt,
        generationTime: Date.now() - startTime,
      };

      await content.save();

      res.status(200).json({
        success: true,
        data: {
          contentId: content._id,
          status: "draft",
          mediaUrl: content.mediaUrl,
          caption: content.caption,
          hashtags: content.hashtags,
          platforms: content.platforms,
        },
      });
    } catch (generationError) {
      console.error("Inner generation error:", generationError);
      content.status = "failed";
      content.error = generationError.message;
      await content.save();

      throw generationError;
    }
  } catch (error) {
    console.error("Content generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate content",
      error: error.message,
    });
  }
};

// @desc    Get content by ID
// @route   GET /api/content/:contentId
// @access  Private
exports.getContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user._id;

    const content = await Content.findOne({ _id: contentId, userId }).populate(
      "businessId",
      "websiteUrl businessType brandProfile",
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Get content error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update content
// @route   PUT /api/content/:contentId
// @access  Private
exports.updateContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { caption, hashtags, scheduledFor } = req.body;
    const userId = req.user._id;

    const content = await Content.findOne({ _id: contentId, userId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // Update fields
    if (caption !== undefined) content.caption = caption;
    if (hashtags !== undefined) content.hashtags = hashtags;
    if (scheduledFor !== undefined) {
      content.scheduledFor = scheduledFor;
      content.status = "scheduled";
    }

    await content.save();

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Update content error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all content for user
// @route   GET /api/content
// @access  Private
exports.getUserContent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, businessId } = req.query;

    const filter = { userId };
    if (status) filter.status = status;
    if (businessId) filter.businessId = businessId;

    const content = await Content.find(filter)
      .sort({ createdAt: -1 })
      .populate("businessId", "websiteUrl businessType");

    res.status(200).json({
      success: true,
      count: content.length,
      data: content,
    });
  } catch (error) {
    console.error("Get user content error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:contentId
// @access  Private
exports.deleteContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user._id;

    const content = await Content.findOne({ _id: contentId, userId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // Delete media files
    if (content.mediaUrl) {
      await storageService.deleteFile(content.mediaUrl);
    }

    await content.deleteOne();

    res.status(200).json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("Delete content error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

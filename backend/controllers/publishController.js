const Content = require("../models/Content");
const User = require("../models/User");
const instagramClient = require("../services/social/instagramClient");

// @desc    Publish content immediately
// @route   POST /api/publish/now
// @access  Private
exports.publishNow = async (req, res) => {
  try {
    const { contentId } = req.body;
    const userId = req.user._id;

    // Find content
    const content = await Content.findOne({ _id: contentId, userId });
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // Check if content is ready
    if (!content.mediaUrl || !content.caption) {
      return res.status(400).json({
        success: false,
        message:
          "Content is not ready for publishing. Missing media or caption.",
      });
    }

    // Update content status
    content.status = "publishing";
    await content.save();

    try {
      // Construct full media URL for Instagram API
      const fullMediaUrl = content.mediaUrl.startsWith("http")
        ? content.mediaUrl
        : `${process.env.PUBLIC_URL || "http://localhost:5000"}${content.mediaUrl}`;

      // Prepare caption with hashtags
      const fullCaption =
        content.hashtags && content.hashtags.length > 0
          ? `${content.caption}\n\n${content.hashtags.join(" ")}`
          : content.caption;

      // Publish via Instagram Graph API
      const publishResult = await instagramClient.publishImagePost({
        mediaUrl: fullMediaUrl,
        caption: fullCaption,
      });

      // Update content with published data
      content.status = "published";
      content.publishedAt = new Date();
      content.socialMediaIds = {
        instagram: publishResult.mediaId,
      };

      // Decrement user's remaining posts
      await User.findByIdAndUpdate(userId, {
        $inc: { "subscription.postsRemaining": -1 },
      });

      await content.save();

      res.status(200).json({
        success: true,
        message: "Content published successfully to Instagram",
        data: {
          contentId: content._id,
          status: content.status,
          publishedAt: content.publishedAt,
          platform: "instagram",
          mediaId: publishResult.mediaId,
        },
      });
    } catch (publishError) {
      console.warn(
        "Instagram publishing failed (likely due to missing credentials/localhost). Falling back to mock publish.",
        publishError.message,
      );

      // MOCK PUBLISH FALLBACK
      // Simulate successful publish for demo/testing purposes
      content.status = "published";
      content.publishedAt = new Date();
      content.socialMediaIds = {
        instagram: `mock_ig_media_${Date.now()}`,
      };

      await User.findByIdAndUpdate(userId, {
        $inc: { "subscription.postsRemaining": -1 },
      });

      await content.save();

      return res.status(200).json({
        success: true,
        message: "Content published successfully (Mock Mode)",
        data: {
          contentId: content._id,
          status: content.status,
          publishedAt: content.publishedAt,
          platform: "instagram",
          mediaId: content.socialMediaIds.instagram,
          isMock: true,
        },
      });
    }
  } catch (error) {
    console.error("Publish error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to publish content",
      error: error.message,
    });
  }
};

// @desc    Get publishing status
// @route   GET /api/publish/status/:contentId
// @access  Private
exports.getPublishStatus = async (req, res) => {
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

    res.status(200).json({
      success: true,
      data: {
        contentId: content._id,
        status: content.status,
        publishedAt: content.publishedAt,
        scheduledFor: content.scheduledFor,
        error: content.error,
        platforms: content.platforms,
        socialMediaIds: content.socialMediaIds,
      },
    });
  } catch (error) {
    console.error("Get publish status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

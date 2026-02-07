const Business = require("../models/Business");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const WebsiteAnalyzer = require("../services/ai/websiteAnalyzer");

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;
const websiteAnalyzer = new WebsiteAnalyzer(genAI);

// @desc    Analyze a website and create business profile
// @route   POST /api/business/analyze
// @access  Private
exports.analyzeWebsite = async (req, res) => {
  try {
    const { websiteUrl } = req.body;
    const userId = req.user._id;

    // Check if business already exists for this URL
    let business = await Business.findOne({ userId, websiteUrl });

    if (business && business.scrapingStatus === "completed") {
      return res.status(200).json({
        success: true,
        message: "Business already analyzed",
        data: {
          businessId: business._id,
          status: "completed",
        },
      });
    }

    // Create or update business record
    if (!business) {
      business = await Business.create({
        userId,
        websiteUrl,
        scrapingStatus: "processing",
      });
    } else {
      business.scrapingStatus = "processing";
      await business.save();
    }

    // Perform analysis (this could be moved to a background job in production)
    try {
      const analysisResult = await websiteAnalyzer.analyzeWebsite(websiteUrl);

      business.brandProfile = {
        colorPalette: analysisResult.colorPalette || [],
        brandTone: analysisResult.brandTone || "professional",
        targetAudience: analysisResult.targetAudience || "general audience",
        description:
          analysisResult.description || analysisResult.websiteTitle || "",
        services: analysisResult.services || [],
        keywords: analysisResult.keywords || [],
      };
      business.businessType = analysisResult.businessType || "general";
      business.scrapingStatus = "completed";
      business.lastScraped = new Date();

      await business.save();

      res.status(202).json({
        success: true,
        data: {
          businessId: business._id,
          status: "completed",
          brandProfile: business.brandProfile,
        },
      });
    } catch (analysisError) {
      business.scrapingStatus = "failed";
      business.scrapingError = analysisError.message;
      await business.save();

      throw analysisError;
    }
  } catch (error) {
    console.error("Website analysis error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze website",
      error: error.message,
    });
  }
};

// @desc    Get business profile
// @route   GET /api/business/:businessId
// @access  Private
exports.getBusinessProfile = async (req, res) => {
  try {
    const { businessId } = req.params;
    const userId = req.user._id;

    const business = await Business.findOne({ _id: businessId, userId });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        businessId: business._id,
        websiteUrl: business.websiteUrl,
        businessType: business.businessType,
        brandProfile: business.brandProfile,
        scrapingStatus: business.scrapingStatus,
        lastScraped: business.lastScraped,
      },
    });
  } catch (error) {
    console.error("Get business error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all businesses for user
// @route   GET /api/business
// @access  Private
exports.getUserBusinesses = async (req, res) => {
  try {
    const userId = req.user._id;

    const businesses = await Business.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses,
    });
  } catch (error) {
    console.error("Get businesses error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

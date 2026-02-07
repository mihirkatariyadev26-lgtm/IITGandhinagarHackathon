class CaptionGenerator {
  constructor(genAI) {
    this.genAI = genAI;
  }

  async generateCaption(prompt, brandProfile, platform = "instagram") {
    if (!this.genAI) {
      // Return a simple caption if no API key
      return this.generateSimpleCaption(prompt, platform);
    }

    try {
      const model = this.genAI.getGenerativeModel({
<<<<<<< Updated upstream
        model: "gemini-1.5-flash",
=======
        model: "gemini-2.0-flash",
>>>>>>> Stashed changes
      });
      const systemPrompt = this.buildSystemPrompt(brandProfile, platform);

      const result = await model.generateContent([
        systemPrompt,
        `Generate a ${platform} caption for: ${prompt}. Include relevant hashtags at the end.`,
      ]);

      const response = await result.response;
      const fullText = response.text();

      // Split caption and hashtags
      const hashtags = this.extractHashtags(fullText);
      const caption = fullText.replace(/#\w+/g, "").trim();

      return {
        caption,
        hashtags,
        characterCount: caption.length,
      };
    } catch (error) {
      console.error("Caption generation error:", error);
      // Fallback to simple caption
      return this.generateSimpleCaption(prompt, platform);
    }
  }

  buildSystemPrompt(brandProfile, platform) {
    const {
      brandTone = "professional",
      targetAudience = "general audience",
      businessType = "business",
    } = brandProfile || {};

    const platformLimits = {
      instagram: 2200,
      facebook: 63206,
      linkedin: 3000,
      twitter: 280,
    };

    return `You are a professional social media copywriter for a ${businessType}.
Brand tone: ${brandTone}
Target audience: ${targetAudience}
Platform: ${platform}
Character limit: ${platformLimits[platform]}

Write engaging, ${brandTone} captions that resonate with ${targetAudience}.
Include 5-10 relevant hashtags at the end.
Use emojis appropriately for ${platform}.
Focus on ${platform === "linkedin" ? "professional value" : "engagement and emotion"}.`;
  }

  extractHashtags(text) {
    const hashtagRegex = /#[\w]+/g;
    const matches = text.match(hashtagRegex);
    return matches || [];
  }

  generateSimpleCaption(prompt, platform) {
    const emojis = {
      instagram: "✨📸🌟",
      facebook: "👍💬",
      linkedin: "💼🎯",
      twitter: "🔥💯",
    };

    const caption = `${prompt} ${emojis[platform] || "✨"}`;
    const hashtags = ["#marketing", "#content", "#socialmedia", "#business"];

    return {
      caption,
      hashtags,
      characterCount: caption.length,
      hashtags,
    };
  }
}

module.exports = CaptionGenerator;

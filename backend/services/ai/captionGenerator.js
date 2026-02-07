class CaptionGenerator {
  constructor(openai) {
    this.openai = openai;
  }

  async generateCaption(prompt, brandProfile, platform = "instagram") {
    if (!this.openai) {
      // Return a simple caption if no API key
      return this.generateSimpleCaption(prompt, platform);
    }

    try {
      const systemPrompt = this.buildSystemPrompt(brandProfile, platform);

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Generate a ${platform} caption for: ${prompt}. Include relevant hashtags at the end.`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const fullText = response.choices[0].message.content;

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
    };
  }
}

module.exports = CaptionGenerator;

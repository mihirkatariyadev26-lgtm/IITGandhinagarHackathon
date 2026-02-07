const axios = require("axios");

class ContentGenerator {
  constructor(openai) {
    this.openai = openai;
  }

  async generateImage(prompt, brandProfile) {
    if (!this.openai) {
      throw new Error(
        "OpenAI client not configured. Please add OPENAI_API_KEY to .env file",
      );
    }

    try {
      // Enhance prompt with brand context
      const enhancedPrompt = this.enhancePrompt(prompt, brandProfile);

      const startTime = Date.now();

      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });

      const generationTime = Date.now() - startTime;
      const imageUrl = response.data[0].url;

      // Download image
      const imageBuffer = await this.downloadImage(imageUrl);

      return {
        imageBuffer,
        imageUrl, // Temporary URL from OpenAI
        metadata: {
          model: "dall-e-3",
          originalPrompt: prompt,
          enhancedPrompt,
          generationTime,
        },
      };
    } catch (error) {
      console.error("Image generation error:", error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }

  enhancePrompt(userPrompt, brandProfile) {
    if (!brandProfile) {
      return userPrompt;
    }

    const {
      colorPalette = [],
      brandTone = "professional",
      keywords = [],
    } = brandProfile;

    let enhanced = userPrompt;

    // Add brand tone
    enhanced += `. Style: ${brandTone}, professional marketing design`;

    // Add color scheme if available
    if (colorPalette.length > 0) {
      enhanced += `. Color scheme: ${colorPalette.slice(0, 3).join(", ")}`;
    }

    // Add brand keywords if available
    if (keywords.length > 0) {
      enhanced += `. Brand keywords: ${keywords.slice(0, 3).join(", ")}`;
    }

    enhanced += `. High quality, commercial photography style`;

    return enhanced;
  }

  async downloadImage(url) {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      return Buffer.from(response.data);
    } catch (error) {
      throw new Error(`Failed to download image: ${error.message}`);
    }
  }

  // Mock image generation for testing without API key
  async generateMockImage() {
    // Return a 1x1 transparent PNG
    return {
      imageBuffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64",
      ),
      imageUrl: null,
      metadata: {
        model: "mock",
        originalPrompt: "mock prompt",
        enhancedPrompt: "mock enhanced prompt",
        generationTime: 100,
      },
    };
  }
}

module.exports = ContentGenerator;

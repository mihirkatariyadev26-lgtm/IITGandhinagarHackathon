const axios = require("axios");

class AyrshareClient {
  constructor() {
    this.baseURL = "https://app.ayrshare.com/api";
    this.apiKey = process.env.AYRSHARE_API_KEY;
  }

  async publishPost(contentData, platforms) {
    if (!this.apiKey) {
      throw new Error(
        "Ayrshare API key not configured. Add AYRSHARE_API_KEY to .env file",
      );
    }

    const { mediaUrl, caption } = contentData;

    // For local development, construct full URL
    const fullMediaUrl = mediaUrl.startsWith("http")
      ? mediaUrl
      : `http://localhost:5000${mediaUrl}`;

    const payload = {
      post: caption,
      platforms: platforms,
      mediaUrls: [fullMediaUrl],
      shortenLinks: true,
    };

    try {
      const response = await axios.post(`${this.baseURL}/post`, payload, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      return {
        success: true,
        postIds: response.data.postIds || {},
        status: response.data.status,
      };
    } catch (error) {
      throw new Error(
        `Publishing failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  async getPostAnalytics(postId, platform) {
    if (!this.apiKey) {
      throw new Error("Ayrshare API key not configured");
    }

    try {
      const response = await axios.get(`${this.baseURL}/analytics/post`, {
        params: { id: postId, platform },
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(
        `Analytics fetch failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  async deletePost(postId, platform) {
    if (!this.apiKey) {
      throw new Error("Ayrshare API key not configured");
    }

    try {
      const response = await axios.delete(`${this.baseURL}/post`, {
        data: { id: postId, platform },
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(
        `Post deletion failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }
}

module.exports = new AyrshareClient();

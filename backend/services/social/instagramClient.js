const axios = require("axios");

class InstagramClient {
  constructor() {
    this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    this.instagramAccountId = process.env.INSTAGRAM_ACCOUNT_ID;
    this.baseURL = "https://graph.facebook.com/v18.0";
  }

  /**
   * Publish a single image post to Instagram
   * @param {Object} contentData - Content data including mediaUrl and caption
   * @returns {Promise<Object>} - Post result with Instagram media ID
   */
  async publishImagePost(contentData) {
    if (!this.accessToken || !this.instagramAccountId) {
      throw new Error(
        "Instagram credentials not configured. Please set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_ACCOUNT_ID in .env file. " +
          "See setup guide for instructions on getting these credentials.",
      );
    }

    const { mediaUrl, caption } = contentData;

    try {
      // Step 1: Create a container (upload media)
      const containerResponse = await axios.post(
        `${this.baseURL}/${this.instagramAccountId}/media`,
        {
          image_url: mediaUrl,
          caption: caption,
          access_token: this.accessToken,
        },
      );

      const creationId = containerResponse.data.id;

      // Step 2: Publish the container
      const publishResponse = await axios.post(
        `${this.baseURL}/${this.instagramAccountId}/media_publish`,
        {
          creation_id: creationId,
          access_token: this.accessToken,
        },
      );

      return {
        success: true,
        mediaId: publishResponse.data.id,
        platform: "instagram",
        message: "Successfully published to Instagram",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || error.message;
      throw new Error(`Instagram publishing failed: ${errorMessage}`);
    }
  }

  /**
   * Get media insights/analytics
   * @param {string} mediaId - Instagram media ID
   * @returns {Promise<Object>} - Media insights
   */
  async getMediaInsights(mediaId) {
    if (!this.accessToken) {
      throw new Error("Instagram access token not configured");
    }

    try {
      const response = await axios.get(`${this.baseURL}/${mediaId}`, {
        params: {
          fields:
            "id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count",
          access_token: this.accessToken,
        },
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || error.message;
      throw new Error(`Failed to fetch Instagram insights: ${errorMessage}`);
    }
  }

  /**
   * Verify account access and credentials
   * @returns {Promise<Object>} - Account info
   */
  async verifyCredentials() {
    if (!this.accessToken || !this.instagramAccountId) {
      throw new Error("Instagram credentials not configured");
    }

    try {
      const response = await axios.get(
        `${this.baseURL}/${this.instagramAccountId}`,
        {
          params: {
            fields: "id,username,name,profile_picture_url",
            access_token: this.accessToken,
          },
        },
      );

      return {
        success: true,
        account: response.data,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || error.message;
      throw new Error(
        `Instagram credential verification failed: ${errorMessage}`,
      );
    }
  }
}

module.exports = new InstagramClient();

const fs = require("fs").promises;
const path = require("path");

class StorageService {
  constructor() {
    // For MVP, use local file storage
    // Can be extended to support AWS S3 or Cloudinary
    this.uploadDir = path.join(__dirname, "../../uploads");
    this.ensureUploadDir();
  }

  async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      await fs.mkdir(path.join(this.uploadDir, "images"), { recursive: true });
      await fs.mkdir(path.join(this.uploadDir, "videos"), { recursive: true });
    } catch (error) {
      console.error("Error creating upload directories:", error);
    }
  }

  async uploadImage(imageBuffer, filename) {
    try {
      const timestamp = Date.now();
      const safeFilename = `${timestamp}_${filename || "image.png"}`;
      const filepath = path.join(this.uploadDir, "images", safeFilename);

      await fs.writeFile(filepath, imageBuffer);

      // Return relative URL (in production, this would be S3/CDN URL)
      return `/uploads/images/${safeFilename}`;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  async uploadVideo(videoBuffer, filename) {
    try {
      const timestamp = Date.now();
      const safeFilename = `${timestamp}_${filename || "video.mp4"}`;
      const filepath = path.join(this.uploadDir, "videos", safeFilename);

      await fs.writeFile(filepath, videoBuffer);

      return `/uploads/videos/${safeFilename}`;
    } catch (error) {
      throw new Error(`Failed to upload video: ${error.message}`);
    }
  }

  async deleteFile(fileUrl) {
    try {
      const filename = path.basename(fileUrl);
      const filepath = path.join(
        this.uploadDir,
        fileUrl.includes("/images/") ? "images" : "videos",
        filename,
      );
      await fs.unlink(filepath);
    } catch (error) {
      console.warn(`Failed to delete file ${fileUrl}:`, error.message);
    }
  }
}

module.exports = new StorageService();

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { contentAPI, publishAPI } from "../../api/client";

function ContentEditor() {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchContent();
  }, [contentId]);

  const fetchContent = async () => {
    try {
      const response = await contentAPI.getContent(contentId);
      const data = response.data.data;
      setContent(data);
      setCaption(data.caption || "");
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await contentAPI.updateContent(contentId, { caption });
      setMessage({ type: "success", text: "Changes saved successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save changes" });
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await publishAPI.publishNow({
        contentId,
        platforms: content.platforms,
      });
      setMessage({ type: "success", text: "Content published successfully!" });
      setTimeout(() => navigate("/dashboard/content"), 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to publish content",
      });
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Content not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate("/dashboard/content")}
          className="text-primary hover:underline mb-6">
          ← Back to Library
        </button>

        {message.text && (
          <div
            className={`mb-6 px-4 py-3 rounded ${message.type === "success" ? "bg-green-100 border border-green-400 text-green-700" : "bg-red-100 border border-red-400 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Preview</h2>
            <div className="bg-white rounded-lg shadow-md p-4">
              {content.mediaUrl && (
                <img
                  src={`http://localhost:5000${content.mediaUrl}`}
                  alt="Content"
                  className="w-full rounded-lg mb-4"
                />
              )}
              <div className="space-y-2">
                <div className="flex gap-2">
                  {content.platforms?.map((platform) => (
                    <span
                      key={platform}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize">
                      {platform}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      content.status === "published"
                        ? "bg-green-200 text-green-800"
                        : content.status === "draft"
                          ? "bg-gray-200 text-gray-800"
                          : "bg-blue-200 text-blue-800"
                    }`}>
                    {content.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Edit Content</h2>
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className=" w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  rows="8"
                  placeholder="Edit your caption..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hashtags
                </label>
                <div className="flex flex-wrap gap-2">
                  {content.hashtags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors">
                  Save Changes
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishing || content.status === "published"}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50">
                  {publishing
                    ? "Publishing..."
                    : content.status === "published"
                      ? "Already Published"
                      : "🚀 Publish Now"}
                </button>
              </div>

              {content.publishedAt && (
                <p className="text-sm text-green-600 text-center">
                  ✅ Published on{" "}
                  {new Date(content.publishedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentEditor;

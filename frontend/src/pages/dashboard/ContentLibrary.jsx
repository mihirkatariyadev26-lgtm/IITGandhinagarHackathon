import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contentAPI } from "../../api/client";

function ContentLibrary() {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await contentAPI.getUserContent();
      setContent(response.data.data);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-gray-200 text-gray-800",
      generating: "bg-blue-200 text-blue-800",
      published: "bg-green-200 text-green-800",
      failed: "bg-red-200 text-red-800",
    };
    return colors[status] || "bg-gray-200 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-primary hover:underline mb-4">
              ← Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-gray-800">
              Content Library
            </h1>
            <p className="text-gray-600 mt-2">All your generated content</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/generate")}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold">
            + Generate New Content
          </button>
        </div>

        {content.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Content Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start generating AI-powered content for your social media
            </p>
            <button
              onClick={() => navigate("/dashboard/generate")}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold">
              Generate Your First Content
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/dashboard/content/${item._id}`)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                {item.mediaUrl && (
                  <img
                    src={`http://localhost:5000${item.mediaUrl}`}
                    alt="Content preview"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {item.caption || "No caption"}
                  </p>
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {item.platforms?.map((platform) => (
                      <span
                        key={platform}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentLibrary;

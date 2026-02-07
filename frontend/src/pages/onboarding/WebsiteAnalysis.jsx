import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { businessAPI } from "../../api/client";

function WebsiteAnalysis() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await businessAPI.analyzeWebsite(url);
      const businessId = response.data.data.businessId;
      navigate(`/onboarding/brand/${businessId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to analyze website");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-10 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Let's Analyze Your Brand
        </h1>
        <p className="text-gray-600 mb-8">
          Enter your website URL and our AI will extract your brand profile
          automatically.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleAnalyze} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://yourwebsite.com"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Make sure the URL includes http:// or https://
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-lg transition-all disabled:opacity-50 text-lg">
            {loading ? "🤖 Analyzing..." : "✨ Analyze My Brand"}
          </button>
        </form>

        {loading && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-center">
              ⏳ Our AI is analyzing your website... This may take 30-60
              seconds.
            </p>
          </div>
        )}

        <div className="mt-8 space-y-3 text-sm text-gray-600">
          <p>✅ Extract brand colors</p>
          <p>✅ Identify business type</p>
          <p>✅ Analyze brand tone</p>
          <p>✅ Understand target audience</p>
        </div>
      </div>
    </div>
  );
}

export default WebsiteAnalysis;

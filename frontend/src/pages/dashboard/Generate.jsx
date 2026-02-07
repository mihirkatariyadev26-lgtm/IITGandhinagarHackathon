import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { businessAPI, contentAPI } from "../../api/client";

function Generate() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [prompt, setPrompt] = useState("");
  const [platforms, setPlatforms] = useState(["instagram"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await businessAPI.getUserBusinesses();
      setBusinesses(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedBusiness(response.data.data[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch businesses:", err);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await contentAPI.generateContent({
        businessId: selectedBusiness,
        prompt,
        platforms,
        contentType: "image",
      });

      const contentId = response.data.data.contentId;
      navigate(`/dashboard/content/${contentId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  if (businesses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">No Business Profile Found</h2>
          <p className="text-gray-600 mb-6">
            Please analyze your website first to create a brand profile.
          </p>
          <button
            onClick={() => navigate("/onboarding/website")}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg">
            Analyze Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-primary hover:underline mb-4">
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Generate Content</h1>
          <p className="text-gray-600 mt-2">
            Create AI-powered marketing content in seconds
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Business Profile
              </label>
              <select
                value={selectedBusiness}
                onChange={(e) => setSelectedBusiness(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                required>
                {businesses.map((business) => (
                  <option key={business._id} value={business._id}>
                    {business.websiteUrl} - {business.businessType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to promote?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                rows="4"
                placeholder="e.g., Our new seasonal coffee drink - Pumpkin Spice Latte"
                required
                minLength={5}
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-1">
                {prompt.length}/500 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platforms
              </label>
              <div className="flex gap-4">
                {["instagram", "facebook", "linkedin", "twitter"].map(
                  (platform) => (
                    <label key={platform} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={platforms.includes(platform)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPlatforms([...platforms, platform]);
                          } else {
                            setPlatforms(
                              platforms.filter((p) => p !== platform),
                            );
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="capitalize">{platform}</span>
                    </label>
                  ),
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || platforms.length === 0}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 text-white font-semibold py-4 rounded-lg transition-all disabled:opacity-50 text-lg">
              {loading ? "🤖 Generating Content..." : "✨ Generate with AI"}
            </button>
          </form>

          {loading && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-center">
                ⏳ Creating your content... This may take 30-60 seconds.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Generate;

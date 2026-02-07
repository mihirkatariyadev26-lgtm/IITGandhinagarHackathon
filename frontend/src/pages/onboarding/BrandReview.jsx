import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { businessAPI } from "../../api/client";

function BrandReview() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusiness();
  }, [businessId]);

  const fetchBusiness = async () => {
    try {
      const response = await businessAPI.getBusinessProfile(businessId);
      setBusiness(response.data.data);
    } catch (error) {
      console.error("Failed to fetch business:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Business not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Review Your Brand Profile</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Website</h2>
            <p className="text-gray-700">{business.websiteUrl}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Business Type</h2>
            <p className="text-gray-700 capitalize">
              {business.businessType || "Not detected"}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Brand Colors</h2>
            <div className="flex gap-3">
              {business.brandProfile?.colorPalette?.map((color, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-lg shadow-md border"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm mt-2">{color}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Brand Tone</h2>
            <p className="text-gray-700 capitalize">
              {business.brandProfile?.brandTone || "Professional"}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Target Audience</h2>
            <p className="text-gray-700">
              {business.brandProfile?.targetAudience || "General audience"}
            </p>
          </div>

          {business.brandProfile?.keywords?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Brand Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {business.brandProfile.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => navigate("/dashboard/generate")}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors">
            Continue to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}

export default BrandReview;

import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const dashboardCards = [
    {
      title: "Generate Content",
      description: "Create stunning AI-powered images and captions",
      icon: "✨",
      gradient: "from-violet-500 to-purple-600",
      link: "/dashboard/generate",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      title: "Content Library",
      description: "View, manage, and edit your content",
      icon: "📚",
      gradient: "from-blue-500 to-cyan-600",
      link: "/dashboard/content",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Brand Profile",
      description: "Update your brand analysis and preferences",
      icon: "🎨",
      gradient: "from-pink-500 to-rose-600",
      link: "/onboarding/website",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI Content Platform
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                to="/dashboard"
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-all">
                Dashboard
              </Link>
              <Link
                to="/dashboard/generate"
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-all">
                Generate
              </Link>
              <Link
                to="/dashboard/content"
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-all">
                Library
              </Link>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center fade-in">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Welcome to Your{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Studio
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your ideas into stunning social media content with the
              power of AI
            </p>

            {/* Quick Stats */}
            <div className="mt-8 flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">∞</div>
                <div className="text-sm text-gray-600 mt-1">
                  Unlimited Ideas
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">⚡</div>
                <div className="text-sm text-gray-600 mt-1">
                  Instant Results
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">🎨</div>
                <div className="text-sm text-gray-600 mt-1">
                  Professional Quality
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dashboardCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="group card-premium hover-lift fade-in"
              style={{ animationDelay: `${index * 100}ms` }}>
              <div
                className={`${card.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span className="text-4xl">{card.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {card.title}
              </h3>
              <p className="text-gray-600 mb-4">{card.description}</p>
              <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform">
                Get started
                <svg
                  className="w-5 h-5 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
            </Link>
          ))}
        </div>

        {/* Getting Started Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 text-white fade-in">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                Ready to Create Magic?
              </h3>
              <p className="text-indigo-100 mb-6">
                Follow these simple steps to generate your first AI-powered
                social media post:
              </p>
              <ol className="space-y-3">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3 font-bold">
                    1
                  </span>
                  <span className="text-indigo-50">
                    Analyze your website to extract brand profile
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3 font-bold">
                    2
                  </span>
                  <span className="text-indigo-50">
                    Generate AI-powered images and captions
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3 font-bold">
                    3
                  </span>
                  <span className="text-indigo-50">
                    Publish directly to Instagram
                  </span>
                </li>
              </ol>
            </div>
            <div className="flex justify-center">
              <Link
                to="/dashboard/generate"
                className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all transform hover:-translate-y-1 shadow-2xl inline-flex items-center">
                Start Creating
                <svg
                  className="w-6 h-6 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { authAPI } from "./api/client";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import WebsiteAnalysis from "./pages/onboarding/WebsiteAnalysis";
import BrandReview from "./pages/onboarding/BrandReview";
import Generate from "./pages/dashboard/Generate";
import ContentLibrary from "./pages/dashboard/ContentLibrary";
import ContentEditor from "./pages/dashboard/ContentEditor";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await authAPI.getMe();
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login setAuth={setIsAuthenticated} />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated ? (
            <Register setAuth={setIsAuthenticated} />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path="/onboarding/website"
        element={
          isAuthenticated ? <WebsiteAnalysis /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/onboarding/brand/:businessId"
        element={isAuthenticated ? <BrandReview /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Dashboard setAuth={setIsAuthenticated} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/dashboard/generate"
        element={isAuthenticated ? <Generate /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard/content"
        element={
          isAuthenticated ? <ContentLibrary /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/dashboard/content/:contentId"
        element={isAuthenticated ? <ContentEditor /> : <Navigate to="/login" />}
      />

      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

export default App;

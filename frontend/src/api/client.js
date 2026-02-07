import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// Business API
export const businessAPI = {
  analyzeWebsite: (websiteUrl) => api.post("/business/analyze", { websiteUrl }),
  getBusinessProfile: (businessId) => api.get(`/business/${businessId}`),
  getUserBusinesses: () => api.get("/business"),
};

// Content API
export const contentAPI = {
  generateContent: (data) => api.post("/content/generate", data),
  getUserContent: (params) => api.get("/content", { params }),
  getContent: (contentId) => api.get(`/content/${contentId}`),
  updateContent: (contentId, data) => api.put(`/content/${contentId}`, data),
  deleteContent: (contentId) => api.delete(`/content/${contentId}`),
};

// Publish API
export const publishAPI = {
  publishNow: (data) => api.post("/publish/now", data),
  getPublishStatus: (contentId) => api.get(`/publish/status/${contentId}`),
};

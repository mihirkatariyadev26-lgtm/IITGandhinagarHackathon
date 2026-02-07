# Quick Setup Guide - AI Content Platform

## ⚠️ Important: Node.js Version Issue

Your current Node.js version is **v22.11.0**, but Vite requires **Node.js 22.12+** or **20.19+**.

### Solution Options:

**Option 1: Downgrade to Node.js 20.x (Recommended)**

```bash
# Using nvm (if installed)
nvm install 20
nvm use 20

# Or download from: https://nodejs.org/en/download/releases
# Install Node.js 20.19.0 LTS
```

**Option 2: Upgrade to Node.js 22.12+**

```bash
# Using nvm
nvm install 22.12.0
nvm use 22.12.0

# Or download latest from: https://nodejs.org/
```

**Option 3: Use the older Vite version (Quick fix)**
Edit `frontend/package.json` and change:

```json
"vite": "^5.0.8"
```

to:

```json
"vite": "^4.5.0"
```

## 📦 Installation Steps

### 1. Backend Setup

```bash
cd backend
npm install
```

**Configure environment variables:**
Edit `backend/.env` and add:

```env
MONGODB_URI=mongodb://localhost:27017/ai-content-platform
JWT_SECRET=your-secure-secret-key-here
OPENAI_API_KEY=sk-your-key-here
```

**Start backend server:**

```bash
npm run dev
```

Server runs on: http://localhost:5000

### 2. Frontend Setup

**After fixing Node.js version:**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

## 🔑 Getting API Keys

### OpenAI (Required for AI features)

1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Add to `backend/.env` as `OPENAI_API_KEY`

### Ayrshare (Optional - for social posting)

1. Go to https://www.ayrshare.com/
2. Sign up for free account
3. Get API key from dashboard
4. Add to `backend/.env` as `AYRSHARE_API_KEY`

### MongoDB

**Option 1: Local MongoDB**

- Install from https://www.mongodb.com/try/download/community
- Use connection string: `mongodb://localhost:27017/ai-content-platform`

**Option 2: MongoDB Atlas (Cloud)**

- Go to https://www.mongodb.com/cloud/atlas/register
- Create free cluster
- Get connection string
- Add to `.env` as `MONGODB_URI`

## 🧪 Testing Without API Keys

The platform has fallback modes:

- **Without OpenAI**: Uses mock image generation and simple caption fallback
- **Without Ayrshare**: Publishing will error (but you can test the UI flow)
- **Without MongoDB**: Server won't start (this is required)

## 🚀 Quick Start (After Setup)

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Register** at http://localhost:3000/register
4. **Analyze Website**: Enter your website URL
5. **Generate Content**: Create AI-powered social media posts
6. **Publish**: Post directly to Instagram (requires Ayrshare)

## 📂 Project Structure

```
IITGandhinagarHackathon/
├── backend/          # Node.js + Express API
│   ├── server.js     # Entry point
│   ├── .env          # Environment variables
│   └── package.json
└── frontend/         # React + Vite app
    ├── src/
    │   ├── App.jsx   # Main app
    │   └── pages/    # All pages
    ├── .env          # Frontend config
    └── package.json
```

## ❓ Troubleshooting

**Error: `ECONNREFUSED 127.0.0.1:27017`**

- MongoDB is not running
- Start MongoDB service or use MongoDB Atlas

**Error: `Invalid API key`**

- Check your OpenAI API key in `.env`
- Make sure there are no extra spaces

**Error: `CORS policy`**

- Backend not running
- Check `CORS_ORIGIN` in backend `.env`

**Frontend won't start (Node version error)**

- Follow Node.js version fix above

## 📝 Current Status

✅ **Backend**: Fully implemented with all endpoints  
✅ **Frontend**: All MVP pages created  
⚠️ **Dependencies**: Need to install after Node.js fix  
⏳ **Testing**: Ready once dependencies installed

---

For full documentation, see [README.md](file:///c:/Users/mihir/OneDrive/New%20folder/OneDrive/Documents/GitHub/IITGandhinagarHackathon/README.md)

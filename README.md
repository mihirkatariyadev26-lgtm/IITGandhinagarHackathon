# AI-Powered Content Automation Platform

An intelligent web-based SaaS platform that automatically generates, and publishes marketing content across multiple social media platforms for small businesses and startups.

## Features

### Phase 1 MVP (Current)

- 🔐 **User Authentication** - Secure JWT-based authentication
- 🤖 **AI Website Analysis** - Automatic brand profile extraction using Puppeteer and GPT-4 Vision
- 🎨 **AI Content Generation** - Generate marketing images using DALL-E 3
- ✍️ **Smart Captions** - AI-generated captions with GPT-4
- 📱 **Social Media Publishing** - Post to Instagram via FREE Instagram Graph API
- 📚 **Content Library** - Manage all generated content

## Tech Stack

### Backend

- **Node.js** + **Express.js** - REST API server
- **MongoDB** + **Mongoose** - Database and ODM
- **OpenAI API** - GPT-4 and DALL-E 3 for AI generation
- **Puppeteer** - Website scraping
- **Instagram Graph API** - Free Instagram posting

### Frontend

- **React** 18.x
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- OpenAI API Key
- Instagram Business Account (for publishing)

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-content-platform
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=sk-your-openai-key-here
AYRSHARE_API_KEY=your-ayrshare-key-here (optional)
CORS_ORIGIN=http://localhost:3000
```

5. Start the server:

```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development server:

```bash
npm start
```

The frontend app will run on `http://localhost:3000`

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Business Intelligence Endpoints

- `POST /api/business/analyze` - Analyze website and extract brand profile (protected)
- `GET /api/business/:businessId` - Get business profile (protected)
- `GET /api/business` - Get all user businesses (protected)

### Content Endpoints

- `POST /api/content/generate` - Generate content with AI (protected)
- `GET /api/content` - Get all user content (protected)
- `GET /api/content/:contentId` - Get single content (protected)
- `PUT /api/content/:contentId` - Update content (protected)
- `DELETE /api/content/:contentId` - Delete content (protected)

### Publishing Endpoints

- `POST /api/publish/now` - Publish content immediately (protected)
- `GET /api/publish/status/:contentId` - Get publishing status (protected)

## Testing

### Backend API Testing

You can test the API using tools like Postman or curl:

1. **Register a user:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User","businessName":"Test Business"}'
```

2. **Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

3. **Analyze website** (requires OpenAI API key):

```bash
curl -X POST http://localhost:5000/api/business/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"websiteUrl":"https://example.com"}'
```

## Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth, validation middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic (AI, storage, social)
│   ├── uploads/         # Generated media files
│   └── server.js        # Express server entry point
│
└── frontend/
    ├── public/          # Static files
    ├── src/
    │   ├── api/         # API client
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── store/       # Redux store
    │   └── App.js       # Main app component
    └── package.json
```

## Environment Variables

### Backend

| Variable           | Description                         | Required        |
| ------------------ | ----------------------------------- | --------------- |
| `MONGODB_URI`      | MongoDB connection string           | Yes             |
| `JWT_SECRET`       | Secret key for JWT tokens           | Yes             |
| `OPENAI_API_KEY`   | OpenAI API key for AI generation    | For AI features |
| `AYRSHARE_API_KEY` | Ayrshare API key for social posting | For publishing  |
| `PORT`             | Server port (default: 5000)         | No              |
| `CORS_ORIGIN`      | Allowed frontend origin             | No              |

### Frontend

| Variable            | Description     | Required |
| ------------------- | --------------- | -------- |
| `REACT_APP_API_URL` | Backend API URL | Yes      |

## Features Roadmap

- [x] Phase 1: MVP
  - [x] Authentication system
  - [x] Website analysis
  - [x] AI content generation
  - [x] Instagram publishing
- [ ] Phase 2: Core Features
  - [ ] Job scheduling with BullMQ
  - [ ] Multi-platform support (Facebook, LinkedIn)
  - [ ] Video generation
  - [ ] Analytics dashboard

- [ ] Phase 3: Advanced Features
  - [ ] Campaign management
  - [ ] Batch content generation
  - [ ] AI-powered insights

## Contributing

This project follows best practices for MERN stack development:

- **MVC Pattern** for backend organization
- **RESTful API** design
- **JWT Authentication** for security
- **Input Validation** with express-validator
- **Error Handling** with proper HTTP status codes

## License

MIT

## Support

For issues and questions, please create an issue in the repository.

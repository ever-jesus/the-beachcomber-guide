# The Beachcomber's Guide - AI-Powered Beach Activity Planner & Tracker

An AI-powered tool designed to help Thoughtworks consultants effectively manage their time while "on the beach" (unallocated to a project). The application provides personalized guidance for skill development, internal contributions, and activities that improve staffing readiness.

## Features

### Core Features
- **AI-Powered Goal Recommendation**: Uses Google's Gemini API to generate personalized SMART goals and activities based on your "Me Now" and "Me Next" profile
- **Profile Management**: Set up and maintain your current skills ("Me Now") and career aspirations ("Me Next")
- **Activity Logging**: Track your daily activities with categories like Learning, Internal Contribution, Demand Generation, etc.
- **Dashboard Overview**: View your profile summary and recent activities in one place

### AI Intelligence
The AI analyzes your profile against Thoughtworks' beach expectations and staffing guidelines to provide:
- Personalized skill development goals
- Internal contribution opportunities
- Demand generation activities
- Networking and growth suggestions

## Project Structure

```
beach-activity-tracker/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Main application pages
│   │   ├── services/        # Firebase and API services
│   │   └── App.tsx          # Main app with routing
├── backend/                  # Node.js TypeScript backend
│   ├── src/
│   │   ├── config/          # Firebase Admin configuration
│   │   ├── middleware/      # Authentication middleware
│   │   ├── models/          # TypeScript interfaces
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # AI service integration
│   │   └── app.ts           # Express app configuration
└── README.md
```

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Firebase Client SDK** for authentication and Firestore

### Backend
- **Node.js** with TypeScript
- **Express.js** for API server
- **Firebase Admin SDK** for server-side operations
- **Google Gemini API** for AI recommendations
- **Firestore** for data persistence

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Firestore enabled
- Google Gemini API key

### Environment Variables

#### Backend (.env)
```env
PORT=5000
FIREBASE_CONFIG={"type": "service_account", ...}
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Frontend
The frontend expects these global variables to be provided by the Canvas environment:
- `__firebase_config`: Firebase client configuration
- `__initial_auth_token`: Initial authentication token (optional)

### Installation

1. **Clone and setup the project:**
```bash
git clone <repository-url>
cd beach-activity-tracker
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

4. **Configure environment variables:**
   - Create `.env` file in the backend directory
   - Add your Firebase service account config and Gemini API key

### Running the Application

1. **Start the backend server:**
```bash
cd backend
npm run dev  # Development mode with hot reload
# or
npm run build && npm start  # Production mode
```

2. **Start the frontend development server:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
All API endpoints require Firebase ID token authentication via Bearer token in the Authorization header.

### Profile Management
- `GET /api/profile/:userId` - Get user profile
- `POST /api/profile` - Create/update user profile

### AI Recommendations
- `POST /api/recommendations` - Generate AI-powered recommendations

### Activity Logging
- `GET /api/activities` - Get user activities
- `POST /api/activities` - Log new activity

## Usage Guide

### Getting Started
1. **Landing Page**: Click "Get Started" to sign in anonymously
2. **Dashboard**: View your profile summary and recent activities
3. **Setup Profile**: Click "Setup My Profile" to define your "Me Now" and "Me Next"
4. **Get Recommendations**: Click "Get AI Recommendations" to receive personalized goals
5. **Log Activities**: Use "Log Activities" to track your daily progress

### Profile Setup
- **Me Now**: Describe your current skills, experience, and competencies
- **Me Next**: Outline your career aspirations and skills you want to develop

### Activity Categories
- **Learning**: Skill development, courses, certifications
- **Internal Contribution**: Internal projects, guild participation, mentoring
- **Demand Generation**: Client proposals, marketing content, sales support
- **Networking**: Coffee chats, events, relationship building
- **Admin/Operational**: Administrative tasks, interviews, meetings
- **Other**: Miscellaneous activities

## Development

### Building for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Code Structure
- **Components**: Reusable UI elements in `frontend/src/components/`
- **Pages**: Main application views in `frontend/src/pages/`
- **Services**: Business logic and API calls in `frontend/src/services/`
- **Routes**: API endpoint handlers in `backend/src/routes/`
- **Middleware**: Authentication and request processing in `backend/src/middleware/`

## Contributing

1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Implement proper error handling
4. Add appropriate loading states
5. Test API endpoints and frontend components

## Future Enhancements

- **Predictive Staffing Readiness Score**: AI-powered assessment of project readiness
- **Smart Time Allocation**: AI suggestions for optimal daily/weekly schedules
- **Integration with Thoughtworks Tools**: Direct integration with Pathways and Jigsaw
- **Advanced Analytics**: Progress tracking and performance insights
- **Mobile App**: React Native version for mobile access

## Support

For issues or questions, please refer to the project documentation or contact the development team. 
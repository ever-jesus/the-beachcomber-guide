# The Beachcomber's Guide - AI-Powered Beach Activity Planner & Tracker

An AI-powered tool designed to help Thoughtworks consultants effectively manage their time while "on the beach" (unallocated to a project). The application provides personalized guidance for skill development, internal contributions, and activities that improve staffing readiness.

## Features

### Core Features
- **AI-Powered Goal Recommendation**: Uses Google's Gemini API to generate personalized SMART goals and activities based on your "Me Now" and "Me Next" profile
- **Enhanced Profile Management**: Set up and maintain your current skills ("Me Now") and career aspirations ("Me Next") with support for multiple data sources
- **PDF Import System**: Import profile data from Jigsaw, Pathways, and Workday PDF files to automatically populate your profile
- **Activity Logging**: Track your daily activities with categories like Learning, Internal Contribution, Demand Generation, etc.
- **Dashboard Overview**: View your profile summary and recent activities in one place

### AI Intelligence
The AI analyzes your profile against Thoughtworks' beach expectations and staffing guidelines to provide:
- Personalized skill development goals
- Internal contribution opportunities
- Demand generation activities
- Networking and growth suggestions
- **Curated Learning Resources**: Specific Udemy courses, YouTube videos, books, and academic papers with direct links

### Profile Management Features
- **Multi-Source Profile Import**: Import data from Jigsaw, Pathways, and Workday PDFs
- **Separate Profile Sections**: View and manage data from each source independently
- **Smart Data Combination**: Automatically combines data from multiple sources for comprehensive profile
- **Auto-Generated "Me Next"**: Intelligently populates career aspirations from Pathways and Workday feedback

### Learning Resources Integration
- **🎓 Udemy Courses**: Direct links to relevant online courses
- **📺 YouTube Videos**: Educational videos from trusted channels
- **📖 Books**: Amazon.com links for purchasing recommended books
- **📄 Papers & Reports**: Free academic papers and industry reports

## Project Structure

```
beach-activity-tracker/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ProfilePDFImports.tsx  # PDF import interface
│   │   │   └── PDFImport.tsx          # Individual PDF upload
│   │   ├── pages/           # Main application pages
│   │   │   ├── ProfileSetup.tsx       # Enhanced profile management
│   │   │   └── Recommendations.tsx    # AI recommendations with links
│   │   ├── services/        # Firebase and API services
│   │   └── App.tsx          # Main app with routing
├── backend/                  # Node.js TypeScript backend
│   ├── src/
│   │   ├── config/          # Firebase Admin configuration
│   │   ├── middleware/      # Authentication middleware
│   │   ├── models/          # TypeScript interfaces
│   │   ├── routes/          # API route handlers
│   │   │   ├── pdfImportRoutes.ts     # PDF processing endpoints
│   │   │   └── recommendationRoutes.ts # Enhanced AI recommendations
│   │   ├── services/        # AI service integration
│   │   │   ├── aiService.ts           # Enhanced with learning resources
│   │   │   └── pdfService.ts          # PDF parsing and processing
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
- **PDF-Parse** for PDF text extraction
- **Multer** for file upload handling

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
MOCK_AUTH_ENABLED=false  # Set to true for development without Firebase
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

### PDF Import System
- `POST /api/pdf-import/import/:profileType` - Import PDF for specific profile type (jigsaw/pathways/workday)
- `GET /api/pdf-import/history` - Get import history for all profile types
- `GET /api/pdf-import/profile/:profileType` - Get specific profile type data

### AI Recommendations
- `POST /api/recommendations` - Generate AI-powered recommendations with learning resources

### Activity Logging
- `GET /api/activities` - Get user activities
- `POST /api/activities` - Log new activity

## Usage Guide

### Getting Started
1. **Landing Page**: Click "Get Started" to sign in anonymously
2. **Dashboard**: View your profile summary and recent activities
3. **Setup Profile**: Click "Setup My Profile" to define your "Me Now" and "Me Next"
4. **Import PDFs**: Upload Jigsaw, Pathways, and Workday PDFs to auto-populate your profile
5. **Get Recommendations**: Click "Get AI Recommendations" to receive personalized goals with learning resources
6. **Log Activities**: Use "Log Activities" to track your daily progress

### Profile Setup & Import

#### Manual Profile Setup
- **Me Now**: Describe your current skills, experience, and competencies
- **Me Next**: Outline your career aspirations and skills you want to develop

#### PDF Import System
- **🧩 Jigsaw Profile**: Import Thoughtworks career development data
- **🛤️ Pathways Profile**: Import career development and aspirations
- **💼 Workday Profile**: Import HR system data and feedback
- **Auto-Generation**: "Me Next" field automatically populated from Pathways and Workday data

#### Profile Sections
Each imported PDF creates a separate section showing:
- **Skills**: Current competencies and capabilities
- **Experience**: Work history and project experience
- **Strengths**: Key strengths and achievements
- **Growth Areas**: Development opportunities
- **Aspirations**: Career goals and objectives

### AI Recommendations with Learning Resources

The AI generates personalized recommendations including:

#### Smart Goals
- **SMART Goals**: Specific, measurable, achievable, relevant, time-bound objectives
- **Contextual Activities**: Based on Thoughtworks beach expectations
- **Staffing Readiness**: Activities that improve project allocation chances

#### Learning Resources
- **🎓 Udemy Courses**: Direct links to relevant online courses
- **📺 YouTube Videos**: Educational videos from trusted channels
- **📖 Books**: Amazon.com links for purchasing recommended books
- **📄 Papers & Reports**: Free academic papers and industry reports

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

### PDF Processing
- **PDF Service**: Handles text extraction and parsing for different profile types
- **Profile Type Detection**: Automatically detects Jigsaw, Pathways, or Workday PDFs
- **Data Extraction**: Parses skills, experience, strengths, and aspirations
- **Data Combination**: Intelligently combines data from multiple sources

## Contributing

1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Implement proper error handling
4. Add appropriate loading states
5. Test API endpoints and frontend components
6. Ensure PDF processing works with various file formats

## Future Enhancements

- **Predictive Staffing Readiness Score**: AI-powered assessment of project readiness
- **Smart Time Allocation**: AI suggestions for optimal daily/weekly schedules
- **Integration with Thoughtworks Tools**: Direct integration with Pathways and Jigsaw APIs
- **Advanced Analytics**: Progress tracking and performance insights
- **Mobile App**: React Native version for mobile access
- **Enhanced PDF Processing**: Support for more PDF formats and better text extraction
- **Learning Progress Tracking**: Track completion of recommended courses and resources

## Support

For issues or questions, please refer to the project documentation or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
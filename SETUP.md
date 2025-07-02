# Setup Guide - The Beachcomber's Guide

## Quick Start

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install-all
```

### 2. Environment Configuration

#### Backend Environment Variables
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
FIREBASE_CONFIG={"type": "service_account", "project_id": "your-project-id", ...}
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Frontend Environment Variables
The frontend expects these global variables to be provided by the Canvas environment:
- `__firebase_config`: Firebase client configuration
- `__initial_auth_token`: Initial authentication token (optional)

### 3. Run the Application

#### Development Mode (Both Frontend and Backend)
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

#### Production Build
```bash
npm run build
npm start
```

## Required Services

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database
3. Create a service account and download the JSON key
4. Add the service account JSON to your backend `.env` file as `FIREBASE_CONFIG`

### Google Gemini API
1. Get a Gemini API key from https://makersuite.google.com/app/apikey
2. Add the API key to your backend `.env` file as `GEMINI_API_KEY`

## Troubleshooting

### TypeScript Compilation Errors
If you encounter TypeScript errors in the backend routes, you can temporarily disable strict checking by modifying `backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": false,
    // ... other options
  }
}
```

### Firebase Authentication Issues
- Ensure your Firebase project has Authentication enabled
- Check that your service account has the necessary permissions
- Verify the Firebase configuration is correctly formatted

### CORS Issues
The backend is configured to allow CORS from all origins in development. For production, update the CORS configuration in `backend/src/app.ts`.

## Development Notes

### Project Structure
- `frontend/`: React TypeScript application
- `backend/`: Node.js Express API server
- `README.md`: Comprehensive project documentation
- `SETUP.md`: This setup guide

### Key Features Implemented
- ✅ User authentication with Firebase
- ✅ Profile management (Me Now/Me Next)
- ✅ AI-powered recommendations using Gemini API
- ✅ Activity logging and tracking
- ✅ Dashboard with profile summary
- ✅ Responsive UI with Tailwind CSS

### Next Steps
1. Configure Firebase and Gemini API keys
2. Test the application locally
3. Deploy to your preferred hosting platform
4. Customize the AI prompts for your specific needs 
import express from 'express';
import cors from 'cors';
import { initializeFirebaseAdmin } from './config/firebase';

// Initialize Firebase Admin SDK BEFORE importing routes
initializeFirebaseAdmin();

// Import routes after Firebase initialization
import profileRoutes from './routes/profileRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import activityRoutes from './routes/activityRoutes';
import pdfImportRoutes from './routes/pdfImportRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Beach Activity Tracker Backend!');
});

// API Routes
app.use('/api/profile', profileRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/pdf-import', pdfImportRoutes);

export default app; 
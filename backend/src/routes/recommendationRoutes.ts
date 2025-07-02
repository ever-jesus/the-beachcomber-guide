import { Router } from 'express';
import { getDbAdmin } from '../config/firebase';
import { authenticateToken } from '../middleware/auth';
import { getGeminiRecommendations } from '../services/aiService';
import { UserProfile } from '../models/UserProfile';

const router = Router();

// Get AI-powered recommendations
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.userId; // Get userId from authenticated token
  const db = getDbAdmin();

  if (!userId) {
    res.status(401).json({ message: 'User not authenticated.' });
    return;
  }

  try {
    // Fetch the user's profile from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      res.status(404).json({ message: 'User profile not found. Please set up your profile first.' });
      return;
    }
    const userProfile = userDoc.data() as UserProfile;

    // Call the AI service to get recommendations
    const recommendations = await getGeminiRecommendations(userProfile);

    // Save recommendations to Firestore for historical tracking (optional for MVP, but good practice)
    await db.collection('users').doc(userId).collection('recommendations').add({
      timestamp: new Date(),
      profileSnapshot: userProfile, // Save what the recommendations were based on
      recommendations: recommendations,
    });

    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error generating or fetching recommendations:', error);
    res.status(500).json({ message: 'Failed to generate recommendations.' });
  }
});

export default router; 
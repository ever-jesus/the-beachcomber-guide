import { Router } from 'express';
import { getDbAdmin } from '../config/firebase';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const db = getDbAdmin();

  // Ensure the authenticated user ID matches the requested user ID for security
  if (req.userId !== userId) {
    res.status(403).json({ message: 'Unauthorized access to profile' });
    return;
  }

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create/Update user profile
router.post('/', authenticateToken, async (req, res) => {
  const { userId, meNow, meNext } = req.body;
  const db = getDbAdmin();

  // Ensure the authenticated user ID matches the requested user ID for security
  if (req.userId !== userId) {
    res.status(403).json({ message: 'Unauthorized profile update' });
    return;
  }

  if (!userId || typeof meNow !== 'string' || typeof meNext !== 'string') {
    res.status(400).json({ message: 'User ID, meNow, and meNext are required' });
    return;
  }

  try {
    await db.collection('users').doc(userId).set({ meNow, meNext }, { merge: true });
    res.status(200).json({ message: 'Profile saved successfully' });
  } catch (error) {
    console.error('Error saving user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 
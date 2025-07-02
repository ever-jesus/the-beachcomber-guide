import { Router } from 'express';
import { getDbAdmin } from '../config/firebase';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Interface for activity data
interface Activity {
  description: string;
  date: string; // ISO string or similar
  category: string;
  timestamp: Date;
}

// Log a new activity
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.userId;
  const { description, date, category } = req.body;
  const db = getDbAdmin();

  if (!userId || !description || !date || !category) {
    res.status(400).json({ message: 'Description, date, and category are required.' });
    return;
  }

  try {
    const newActivity: Activity = {
      description,
      date,
      category,
      timestamp: new Date(), // Server-side timestamp
    };
    await db.collection('users').doc(userId).collection('activities').add(newActivity);
    res.status(201).json({ message: 'Activity logged successfully!', activity: newActivity });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ message: 'Failed to log activity.' });
  }
});

// Get all activities for a user
router.get('/', authenticateToken, async (req, res): Promise<void> => {
  const userId = req.userId;
  const db = getDbAdmin();

  if (!userId) {
    res.status(401).json({ message: 'User not authenticated.' });
    return;
  }

  try {
    const activitiesSnapshot = await db.collection('users').doc(userId).collection('activities').orderBy('timestamp', 'desc').get();
    const activities = activitiesSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Failed to fetch activities.' });
  }
});

export default router; 
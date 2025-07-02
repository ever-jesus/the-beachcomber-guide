import { Request, Response, NextFunction } from 'express';
import { getAuthAdmin } from '../config/firebase';

// Extend the Request interface to include a userId property
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Mock authentication for development
const MOCK_AUTH_ENABLED = process.env.MOCK_AUTH_ENABLED === 'true' || process.env.NODE_ENV === 'development';
console.log('MOCK_AUTH_ENABLED:', MOCK_AUTH_ENABLED); // Debug log

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const idToken = authHeader.split(' ')[1];
  console.log('Received token type:', idToken.startsWith('mock-id-token-for-') ? 'mock' : 'firebase');
  console.log('Token preview:', idToken.substring(0, 20) + '...');

  // Handle mock authentication tokens
  if (MOCK_AUTH_ENABLED && idToken.startsWith('mock-id-token-for-')) {
    try {
      // Extract user ID from mock token format: mock-id-token-for-{uid}
      const userId = idToken.replace('mock-id-token-for-', '');
      
      if (userId) {
        req.userId = userId;
        console.log('Mock authentication successful for user:', userId);
        next();
        return;
      } else {
        throw new Error('Invalid mock token format');
      }
    } catch (error) {
      console.error('Error processing mock token:', error);
      return res.status(403).json({ message: 'Invalid mock token' });
    }
  }

  // Handle real Firebase authentication
  try {
    console.log('Attempting Firebase token verification...');
    const decodedToken = await getAuthAdmin().verifyIdToken(idToken);
    req.userId = decodedToken.uid; // Attach userId to the request
    console.log('Firebase authentication successful for user:', decodedToken.uid);
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}; 
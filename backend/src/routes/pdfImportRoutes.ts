import { Router } from 'express';
import multer from 'multer';
import { getDbAdmin } from '../config/firebase';
import { authenticateToken } from '../middleware/auth';
import { PDFService, ProfileType } from '../services/pdfService';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// Import PDF for specific profile type
router.post('/import/:profileType', authenticateToken, upload.single('pdf'), async (req, res) => {
  const userId = req.userId;
  const profileType = req.params.profileType as ProfileType;
  const db = getDbAdmin();

  if (!userId) {
    res.status(401).json({ message: 'User not authenticated.' });
    return;
  }

  if (!['jigsaw', 'pathways', 'workday'].includes(profileType)) {
    res.status(400).json({ message: 'Invalid profile type. Must be jigsaw, pathways, or workday.' });
    return;
  }

  if (!req.file) {
    res.status(400).json({ message: 'No PDF file uploaded.' });
    return;
  }

  try {
    // Parse the PDF based on profile type
    const parsedData = await PDFService.parsePDFByType(req.file.buffer, profileType);
    
    // Generate profile content from parsed data
    const meNow = generateMeNow(parsedData);
    const meNext = generateMeNext(parsedData);
    
    // Save to Firestore with profile type specific data
    const updateData: any = {
      [`${profileType}Profile`]: {
        meNow,
        meNext,
        importedData: parsedData,
        lastImported: new Date(),
        importSource: req.file.originalname
      }
    };

    // Update the main profile fields by combining all profile types
    const userDoc = await db.collection('users').doc(userId).get();
    const existingData = userDoc.exists ? userDoc.data() : {};
    
    // Combine all profile types for main meNow and meNext
    const allProfiles = {
      jigsaw: existingData?.jigsawProfile || {},
      pathways: existingData?.pathwaysProfile || {},
      workday: existingData?.workdayProfile || {}
    };
    
    // Update the current profile type
    allProfiles[profileType] = {
      meNow,
      meNext,
      importedData: parsedData,
      lastImported: new Date(),
      importSource: req.file.originalname
    };

    // Combine all profiles for main profile fields
    const combinedMeNow = combineProfileFields(Object.values(allProfiles).map(p => p.meNow));
    const combinedMeNext = generateMeNextFromProfiles(allProfiles);

    updateData.meNow = combinedMeNow;
    updateData.meNext = combinedMeNext;

    await db.collection('users').doc(userId).set(updateData, { merge: true });

    res.status(200).json({
      message: `${profileType} PDF imported successfully`,
      parsedData,
      generatedProfile: {
        meNow,
        meNext
      },
      profileType
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ 
      message: 'Failed to process PDF',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get import history for all profile types
router.get('/history', authenticateToken, async (req, res) => {
  const userId = req.userId;
  const db = getDbAdmin();

  if (!userId) {
    res.status(401).json({ message: 'User not authenticated.' });
    return;
  }

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      res.status(404).json({ message: 'User profile not found.' });
      return;
    }

    const userData = userDoc.data();
    const importHistory = {
      jigsaw: userData?.jigsawProfile ? {
        lastImported: userData.jigsawProfile.lastImported,
        importSource: userData.jigsawProfile.importSource,
        hasImportedData: !!userData.jigsawProfile.importedData
      } : null,
      pathways: userData?.pathwaysProfile ? {
        lastImported: userData.pathwaysProfile.lastImported,
        importSource: userData.pathwaysProfile.importSource,
        hasImportedData: !!userData.pathwaysProfile.importedData
      } : null,
      workday: userData?.workdayProfile ? {
        lastImported: userData.workdayProfile.lastImported,
        importSource: userData.workdayProfile.importSource,
        hasImportedData: !!userData.workdayProfile.importedData
      } : null
    };

    res.status(200).json(importHistory);
  } catch (error) {
    console.error('Error fetching import history:', error);
    res.status(500).json({ message: 'Failed to fetch import history.' });
  }
});

// Get specific profile type data
router.get('/profile/:profileType', authenticateToken, async (req, res) => {
  const userId = req.userId;
  const profileType = req.params.profileType as ProfileType;
  const db = getDbAdmin();

  if (!userId) {
    res.status(401).json({ message: 'User not authenticated.' });
    return;
  }

  if (!['jigsaw', 'pathways', 'workday'].includes(profileType)) {
    res.status(400).json({ message: 'Invalid profile type. Must be jigsaw, pathways, or workday.' });
    return;
  }

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      res.status(404).json({ message: 'User profile not found.' });
      return;
    }

    const userData = userDoc.data();
    const profileData = userData?.[`${profileType}Profile`];

    if (!profileData) {
      res.status(404).json({ message: `${profileType} profile not found.` });
      return;
    }

    res.status(200).json(profileData);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ message: 'Failed to fetch profile data.' });
  }
});

// Helper functions to generate profile content
function generateMeNow(parsedData: any): string {
  const parts = [];
  
  if (parsedData.skills && parsedData.skills.length > 0) {
    parts.push(`Skills: ${parsedData.skills.slice(0, 5).join(', ')}`);
  }
  
  if (parsedData.experience && parsedData.experience.length > 0) {
    parts.push(`Experience: ${parsedData.experience.slice(0, 3).join('; ')}`);
  }
  
  if (parsedData.strengths && parsedData.strengths.length > 0) {
    parts.push(`Strengths: ${parsedData.strengths.slice(0, 3).join(', ')}`);
  }
  
  return parts.join('. ');
}

function generateMeNext(parsedData: any): string {
  const parts = [];
  
  if (parsedData.aspirations && parsedData.aspirations.length > 0) {
    parts.push(`Aspirations: ${parsedData.aspirations.slice(0, 3).join('; ')}`);
  }
  
  if (parsedData.areasForGrowth && parsedData.areasForGrowth.length > 0) {
    parts.push(`Areas for Growth: ${parsedData.areasForGrowth.slice(0, 3).join(', ')}`);
  }
  
  return parts.join('. ');
}

function combineProfileFields(fields: string[]): string {
  const validFields = fields.filter(field => field && field.trim().length > 0);
  if (validFields.length === 0) return '';
  
  // Combine all fields, removing duplicates and organizing by content
  const allContent = validFields.join(' ');
  const sentences = allContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Remove duplicates and limit to reasonable length
  const uniqueSentences = [...new Set(sentences)].slice(0, 5);
  return uniqueSentences.join('. ') + (uniqueSentences.length > 0 ? '.' : '');
}

function generateMeNextFromProfiles(allProfiles: any): string {
  const parts = [];
  
  // Get Pathways aspirations (primary source for career goals)
  if (allProfiles.pathways?.importedData?.aspirations) {
    const aspirations = allProfiles.pathways.importedData.aspirations;
    if (aspirations.length > 0) {
      parts.push(`Career Aspirations: ${aspirations.slice(0, 3).join('; ')}`);
    }
  }
  
  // Get Workday feedback and development areas
  if (allProfiles.workday?.importedData) {
    const workdayData = allProfiles.workday.importedData;
    
    if (workdayData.areasForGrowth && workdayData.areasForGrowth.length > 0) {
      parts.push(`Development Focus: ${workdayData.areasForGrowth.slice(0, 2).join(', ')}`);
    }
    
    if (workdayData.aspirations && workdayData.aspirations.length > 0) {
      parts.push(`Workday Goals: ${workdayData.aspirations.slice(0, 2).join('; ')}`);
    }
  }
  
  // Fallback to other profile types if Pathways and Workday don't have enough data
  if (parts.length === 0) {
    if (allProfiles.jigsaw?.importedData?.aspirations) {
      const aspirations = allProfiles.jigsaw.importedData.aspirations;
      if (aspirations.length > 0) {
        parts.push(`Career Goals: ${aspirations.slice(0, 2).join('; ')}`);
      }
    }
  }
  
  return parts.join('. ');
}

export default router; 
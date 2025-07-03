import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import ProfilePDFImports from '../components/ProfilePDFImports';
import { getUserId, getCurrentUser } from '../services/firebase';

interface UserProfile {
  meNow: string;
  meNext: string;
  jigsawProfile?: any;
  pathwaysProfile?: any;
  workdayProfile?: any;
}

interface ProfileSetupProps {
  onSignOut: () => Promise<void>;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onSignOut }) => {
  const [meNow, setMeNow] = useState<string>('');
  const [meNext, setMeNext] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPDFImport, setShowPDFImport] = useState<boolean>(false);
  const [importHistory, setImportHistory] = useState<any>(null);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  const userId = getUserId();

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchImportHistory();
    }
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        setMessage('Authentication token not found.');
        setLoading(false);
        return;
      }

      const idToken = await currentUser.getIdToken();
      if (!idToken) {
        setMessage('Authentication token not found.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });
      if (response.ok) {
        const data: UserProfile = await response.json();
        setProfileData(data);
        setMeNow(data.meNow || '');
        setMeNext(data.meNext || '');
      } else if (response.status === 404) {
        setMessage('No profile found. Please create one.');
      } else {
        setMessage('Failed to fetch profile.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Error fetching profile.');
    } finally {
      setLoading(false);
    }
  };

  const fetchImportHistory = async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) return;

      const idToken = await currentUser.getIdToken();
      if (!idToken) return;

      const response = await fetch(`${API_BASE_URL}/api/pdf-import/history`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setImportHistory(data);
      }
    } catch (error) {
      console.error('Error fetching import history:', error);
    }
  };

  const handlePDFImportSuccess = (data: any, profileType: string) => {
    setMessage(`${profileType} PDF imported successfully! Your profile has been updated.`);
    setMeNow(data.generatedProfile.meNow);
    setMeNext(data.generatedProfile.meNext);
    fetchProfile(); // Refresh profile data to show new sections
    fetchImportHistory();
  };

  const handlePDFImportError = (error: string) => {
    setMessage(`PDF import failed: ${error}`);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setMessage('User not authenticated.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        setMessage('Authentication token not found.');
        setLoading(false);
        return;
      }

      const idToken = await currentUser.getIdToken();
      if (!idToken) {
        setMessage('Authentication token not found.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ userId, meNow, meNext }),
      });

      if (response.ok) {
        setMessage('Profile saved successfully!');
      } else {
        const errorData = await response.json();
        setMessage(`Failed to save profile: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Error saving profile.');
    } finally {
      setLoading(false);
    }
  };

  const generateProfileSummary = (profileData: any, profileType: string) => {
    if (!profileData || !profileData.importedData) {
      return 'No data imported yet.';
    }

    const data = profileData.importedData;
    const parts = [];

    if (data.skills && data.skills.length > 0) {
      parts.push(`**Skills:** ${data.skills.slice(0, 3).join(', ')}`);
    }
    
    if (data.experience && data.experience.length > 0) {
      parts.push(`**Experience:** ${data.experience.slice(0, 2).join('; ')}`);
    }
    
    if (data.strengths && data.strengths.length > 0) {
      parts.push(`**Strengths:** ${data.strengths.slice(0, 2).join(', ')}`);
    }

    if (data.areasForGrowth && data.areasForGrowth.length > 0) {
      parts.push(`**Growth Areas:** ${data.areasForGrowth.slice(0, 2).join(', ')}`);
    }

    return parts.length > 0 ? parts.join('\n\n') : 'Data imported but no structured information found.';
  };

  const generateMeNextFromProfiles = () => {
    const parts = [];
    
    // Get Pathways aspirations
    if (profileData?.pathwaysProfile?.importedData?.aspirations) {
      const aspirations = profileData.pathwaysProfile.importedData.aspirations;
      if (aspirations.length > 0) {
        parts.push(`**Career Aspirations:** ${aspirations.slice(0, 3).join('; ')}`);
      }
    }

    // Get Workday feedback and development areas
    if (profileData?.workdayProfile?.importedData) {
      const workdayData = profileData.workdayProfile.importedData;
      
      if (workdayData.areasForGrowth && workdayData.areasForGrowth.length > 0) {
        parts.push(`**Development Focus:** ${workdayData.areasForGrowth.slice(0, 2).join(', ')}`);
      }
      
      if (workdayData.aspirations && workdayData.aspirations.length > 0) {
        parts.push(`**Workday Goals:** ${workdayData.aspirations.slice(0, 2).join('; ')}`);
      }
    }

    return parts.length > 0 ? parts.join('\n\n') : '';
  };

  if (loading && !message) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Navigation and Sign Out */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Profile Setup</h1>
          </div>
          <button
            onClick={onSignOut}
            className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">My Profile</h2>
          {message && (
            <p className={`mb-4 text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          {/* PDF Import Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Import Profile Data</h3>
              <button
                onClick={() => setShowPDFImport(!showPDFImport)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showPDFImport ? 'Hide Import' : 'Show Import'}
              </button>
            </div>
            
            {showPDFImport && (
              <ProfilePDFImports
                onImportSuccess={handlePDFImportSuccess}
                onImportError={handlePDFImportError}
                importHistory={importHistory}
              />
            )}
          </div>

          {/* Profile Sections */}
          <div className="space-y-6">
            {/* Jigsaw Profile Section */}
            <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">🧩</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Jigsaw Profile</h3>
                  <p className="text-sm text-gray-600">Thoughtworks career development data</p>
                </div>
                {profileData?.jigsawProfile && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Imported
                  </span>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {profileData?.jigsawProfile 
                    ? generateProfileSummary(profileData.jigsawProfile, 'jigsaw')
                    : 'No Jigsaw data imported yet. Upload a Jigsaw PDF to see your profile summary here.'
                  }
                </pre>
              </div>
            </div>

            {/* Pathways Profile Section */}
            <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">🛤️</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Pathways Profile</h3>
                  <p className="text-sm text-gray-600">Career development and aspirations</p>
                </div>
                {profileData?.pathwaysProfile && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                    Imported
                  </span>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {profileData?.pathwaysProfile 
                    ? generateProfileSummary(profileData.pathwaysProfile, 'pathways')
                    : 'No Pathways data imported yet. Upload a Pathways PDF to see your profile summary here.'
                  }
                </pre>
              </div>
            </div>

            {/* Workday Profile Section */}
            <div className="border border-green-200 rounded-lg p-6 bg-green-50">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">💼</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Workday Profile</h3>
                  <p className="text-sm text-gray-600">HR system data and feedback</p>
                </div>
                {profileData?.workdayProfile && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Imported
                  </span>
                )}
              </div>
              
              <div className="bg-white p-4 rounded border">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {profileData?.workdayProfile 
                    ? generateProfileSummary(profileData.workdayProfile, 'workday')
                    : 'No Workday data imported yet. Upload a Workday PDF to see your profile summary here.'
                  }
                </pre>
              </div>
            </div>

            {/* Me Next Section - Auto-generated from Pathways and Workday */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Me Next - Career Aspirations & Development</h3>
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This field is automatically populated from your Pathways aspirations and Workday feedback. 
                  You can manually edit it below.
                </p>
              </div>
              
              <TextArea
                label="Me Next: What are your career aspirations and desired skills?"
                placeholder="This will be auto-populated from your Pathways and Workday data..."
                value={meNext}
                onChange={(e) => setMeNext(e.target.value)}
              />
              
              {/* Auto-generate button */}
              <button
                type="button"
                onClick={() => {
                  const autoGenerated = generateMeNextFromProfiles();
                  if (autoGenerated) {
                    setMeNext(autoGenerated);
                    setMessage('Me Next field updated with data from your imported profiles!');
                  } else {
                    setMessage('No Pathways or Workday data available to auto-generate Me Next.');
                  }
                }}
                className="mt-2 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:shadow-outline-yellow font-semibold"
              >
                Auto-generate from imported data
              </button>
            </div>

            {/* Save Button */}
            <div className="border-t pt-6">
              <button
                onClick={handleSaveProfile}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue font-semibold"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup; 
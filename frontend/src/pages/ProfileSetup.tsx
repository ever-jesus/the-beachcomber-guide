import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import { getUserId, getCurrentUser } from '../services/firebase';

interface UserProfile {
  meNow: string;
  meNext: string;
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

  const userId = getUserId();

  useEffect(() => {
    if (userId) {
      fetchProfile();
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
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
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

      <div className="flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">My Profile</h2>
          {message && (
            <p className={`mb-4 text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
          <form onSubmit={handleSaveProfile}>
            <TextArea
              label="Me Now: What are your current skills and experience?"
              placeholder="e.g., Senior Software Engineer (Java, Spring Boot, AWS), Agile Coach, Public Speaker..."
              value={meNow}
              onChange={(e) => setMeNow(e.target.value)}
            />
            <TextArea
              label="Me Next: What are your career aspirations and desired skills?"
              placeholder="e.g., Become a Principal Consultant, learn Golang and Kubernetes, lead a larger team..."
              value={meNext}
              onChange={(e) => setMeNext(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue font-semibold"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup; 
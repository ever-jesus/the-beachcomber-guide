import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserId, getCurrentUser, isMockAuthEnabled, getMockUsers } from '../services/firebase';

interface UserProfile {
  meNow: string;
  meNext: string;
}

interface Activity {
  id?: string;
  description: string;
  date: string;
  category: string;
  timestamp?: Date;
}

interface DashboardProps {
  onSignOut: () => Promise<void>;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const Dashboard: React.FC<DashboardProps> = ({ onSignOut }) => {
  const userId = getUserId();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [loadingActivities, setLoadingActivities] = useState<boolean>(true);
  const [currentUserInfo, setCurrentUserInfo] = useState<{ displayName: string; role: string; email: string } | null>(null);

  // Get current user info for mock authentication
  useEffect(() => {
    if (isMockAuthEnabled() && userId) {
      const mockUsers = getMockUsers();
      const currentUser = getCurrentUser();
      
      if (currentUser) {
        const mockUser = mockUsers.find(user => user.email === currentUser.email);
        if (mockUser) {
          setCurrentUserInfo({
            displayName: mockUser.displayName,
            role: mockUser.role,
            email: mockUser.email
          });
        }
      }
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    if (!userId) {
      setLoadingProfile(false);
      return;
    }
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        setLoadingProfile(false);
        return;
      }

      const idToken = await currentUser.getIdToken();
      if (!idToken) {
        setLoadingProfile(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });
      if (response.ok) {
        const data: UserProfile = await response.json();
        setUserProfile(data);
      } else if (response.status === 404) {
        // No profile yet, that's fine
      } else {
        console.error('Failed to fetch profile for dashboard:', await response.json());
      }
    } catch (error) {
      console.error('Error fetching profile for dashboard:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchRecentActivities = async () => {
    if (!userId) {
      setLoadingActivities(false);
      return;
    }
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        setLoadingActivities(false);
        return;
      }

      const idToken = await currentUser.getIdToken();
      if (!idToken) {
        setLoadingActivities(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/activities`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });
      if (response.ok) {
        const data: Activity[] = await response.json();
        // Take up to 3 most recent activities for dashboard summary
        setRecentActivities(data.slice(0, 3));
      } else {
        console.error('Failed to fetch activities for dashboard:', await response.json());
      }
    } catch (error) {
      console.error('Error fetching activities for dashboard:', error);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchRecentActivities();
  }, [userId]); // Re-fetch if userId changes

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Sign Out */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Beach Tracker</h1>
          <div className="flex items-center space-x-4">
            {isMockAuthEnabled() && currentUserInfo && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{currentUserInfo.displayName}</span>
                <span className="mx-1">•</span>
                <span>{currentUserInfo.role}</span>
              </div>
            )}
            <button
              onClick={onSignOut}
              className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome!</h2>
          
          {/* User Information */}
          {isMockAuthEnabled() && currentUserInfo ? (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-medium text-blue-800 mb-1">{currentUserInfo.displayName}</p>
              <p className="text-sm text-blue-600 mb-2">{currentUserInfo.role}</p>
              <p className="text-xs text-blue-500">{currentUserInfo.email}</p>
            </div>
          ) : (
            userId && <p className="text-gray-600 mb-6">Your User ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{userId}</span></p>
          )}
          
          <p className="text-gray-700 mb-8">Let's get you ready for your next big thing.</p>

          {/* Profile Summary */}
          <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50 text-left">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Your Profile Snapshot</h3>
            {loadingProfile ? (
              <p className="text-gray-600">Loading profile...</p>
            ) : userProfile ? (
              <>
                <p className="text-gray-700 mb-2">**Me Now:** {userProfile.meNow || 'Not set yet.'}</p>
                <p className="text-gray-700">**Me Next:** {userProfile.meNext || 'Not set yet.'}</p>
              </>
            ) : (
              <p className="text-gray-600">No profile set up yet. Go to "Setup My Profile" to get started!</p>
            )}
            <div className="text-right mt-2">
              <Link to="/profile" className="text-blue-600 hover:underline text-sm">Edit Profile</Link>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50 text-left">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Recent Activities</h3>
            {loadingActivities ? (
              <p className="text-gray-600">Loading activities...</p>
            ) : recentActivities.length > 0 ? (
              <ul className="space-y-2">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="border-b last:border-b-0 border-gray-200 pb-2">
                    <p className="text-sm text-gray-500">{activity.date} - {activity.category}</p>
                    <p className="text-gray-800 text-sm">{activity.description.substring(0, 100)}...</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No activities logged yet. Go to "Log Activities" to add some!</p>
            )}
            <div className="text-right mt-2">
              <Link to="/activities" className="text-green-600 hover:underline text-sm">View All Activities</Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <Link
              to="/profile"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue font-semibold"
            >
              Setup My Profile
            </Link>
            <Link
              to="/recommendations"
              className="block w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple font-semibold"
            >
              Get AI Recommendations
            </Link>
            <Link
              to="/activities"
              className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:shadow-outline-green font-semibold"
            >
              Log Activities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
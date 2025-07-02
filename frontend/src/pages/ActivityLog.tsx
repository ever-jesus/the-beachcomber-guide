import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import { getUserId, getCurrentUser } from '../services/firebase';

interface Activity {
  id?: string; // Optional ID for fetched activities
  description: string;
  date: string;
  category: string;
  timestamp?: Date; // Optional, set by backend
}

interface ActivityLogProps {
  onSignOut: () => Promise<void>;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const ActivityLog: React.FC<ActivityLogProps> = ({ onSignOut }) => {
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to today
  const [category, setCategory] = useState<string>('Learning'); // Default category
  const [activities, setActivities] = useState<Activity[]>([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const userId = getUserId();

  const fetchActivities = async () => {
    if (!userId) return;

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

      const response = await fetch(`${API_BASE_URL}/api/activities`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const data: Activity[] = await response.json();
        setActivities(data);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to fetch activities: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setMessage('Error fetching activities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [userId]); // Refetch when userId changes

  const handleLogActivity = async (e: React.FormEvent) => {
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

      const response = await fetch(`${API_BASE_URL}/api/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ description, date, category }),
      });

      if (response.ok) {
        setMessage('Activity logged successfully!');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]); // Reset date to today
        setCategory('Learning'); // Reset category
        fetchActivities(); // Refresh the list of activities
      } else {
        const errorData = await response.json();
        setMessage(`Failed to log activity: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
      setMessage('Error logging activity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Navigation and Sign Out */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Activity Log</h1>
          </div>
          <button
            onClick={onSignOut}
            className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Log Your Activities</h2>
          {message && (
            <p className={`mb-4 text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
          <form onSubmit={handleLogActivity}>
            <TextArea
              label="Activity Description"
              placeholder="e.g., Completed Module 3 of AWS Architect course, Contributed to internal thought leadership piece, Had a coffee chat with a Staffing Partner."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <div className="mb-4">
              <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                Category
              </label>
              <select
                id="category"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Learning">Learning</option>
                <option value="Internal Contribution">Internal Contribution</option>
                <option value="Demand Generation">Demand Generation</option>
                <option value="Networking">Networking</option>
                <option value="Admin/Operational">Admin/Operational</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue font-semibold"
              disabled={loading}
            >
              {loading ? 'Logging...' : 'Log Activity'}
            </button>
          </form>

          <h3 className="text-xl font-bold mt-8 mb-4 text-gray-800">My Activities</h3>
          {loading && activities.length === 0 ? (
            <p className="text-gray-600 text-center">Loading activities...</p>
          ) : activities.length === 0 ? (
            <p className="text-gray-600 text-center">No activities logged yet.</p>
          ) : (
            <ul className="space-y-3">
              {activities.map((activity) => (
                <li key={activity.id} className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">{activity.date} - {activity.category}</p>
                  <p className="text-gray-800">{activity.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog; 
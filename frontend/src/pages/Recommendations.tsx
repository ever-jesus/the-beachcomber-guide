import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserId, getCurrentUser } from '../services/firebase';

interface LearningResource {
  title: string;
  link: string;
}

interface LearningResources {
  udemyCourses?: LearningResource[];
  youtubeVideos?: LearningResource[];
  books?: LearningResource[];
  papers?: LearningResource[];
}

interface Recommendation {
  goal: string;
  activities: string[];
  learningResources?: LearningResources;
}

interface RecommendationsProps {
  onSignOut: () => Promise<void>;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const Recommendations: React.FC<RecommendationsProps> = ({ onSignOut }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const userId = getUserId();

  const fetchRecommendations = async () => {
    if (!userId) {
      setMessage('User not authenticated.');
      return;
    }

    setLoading(true);
    setMessage('');
    setRecommendations([]);

    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        setMessage('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      const idToken = await currentUser.getIdToken();
      if (!idToken) {
        setMessage('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
        method: 'POST', // Recommendations are generated based on current profile, so POST is appropriate
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ userId }), // Backend will fetch profile by userId from token
      });

      if (response.ok) {
        const data: Recommendation[] = await response.json();
        setRecommendations(data);
        if (data.length === 0) {
          setMessage('No recommendations generated. Try updating your profile.');
        } else {
          setMessage('Recommendations loaded successfully!');
        }
      } else {
        const errorData = await response.json();
        setMessage(`Failed to load recommendations: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setMessage('Error fetching recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const LearningResourceSection = ({ resources, title, icon, color }: { 
    resources: LearningResource[], 
    title: string, 
    icon: string, 
    color: string 
  }) => {
    if (!resources || resources.length === 0) return null;

    return (
      <div className={`border-l-4 ${color} pl-4 mb-4`}>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg">{icon}</span>
          <h4 className="font-semibold text-gray-800">{title}</h4>
        </div>
        <ul className="space-y-2">
          {resources.map((resource, index) => (
            <li key={index} className="text-sm">
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline flex items-start group"
              >
                <span className="text-gray-400 mr-2 group-hover:text-blue-600">•</span>
                <span className="flex-1">{resource.title}</span>
                <span className="text-xs text-gray-400 ml-2 group-hover:text-blue-600">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Navigation and Sign Out */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">AI Recommendations</h1>
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
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">My AI Recommendations</h2>
          {message && (
            <p className={`mb-4 text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
          <button
            onClick={fetchRecommendations}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple font-semibold mb-6"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate New Recommendations'}
          </button>

          {recommendations.length > 0 && (
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">{rec.goal}</h3>
                  
                  {/* Activities Section */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="mr-2">🎯</span>
                      Recommended Activities
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {rec.activities.map((activity, actIndex) => (
                        <li key={actIndex}>{activity}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Learning Resources Section */}
                  {rec.learningResources && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="mr-2">📚</span>
                        Learning Resources
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <LearningResourceSection
                          resources={rec.learningResources.udemyCourses || []}
                          title="Udemy Courses"
                          icon="🎓"
                          color="border-blue-500"
                        />
                        
                        <LearningResourceSection
                          resources={rec.learningResources.youtubeVideos || []}
                          title="YouTube Videos"
                          icon="📺"
                          color="border-red-500"
                        />
                        
                        <LearningResourceSection
                          resources={rec.learningResources.books || []}
                          title="Books (Amazon)"
                          icon="📖"
                          color="border-green-500"
                        />
                        
                        <LearningResourceSection
                          resources={rec.learningResources.papers || []}
                          title="Papers & Reports"
                          icon="📄"
                          color="border-purple-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">About These Recommendations</h3>
            <p className="text-sm text-blue-700 mb-2">
              These AI-generated recommendations are based on your current profile and career aspirations. 
              They include specific learning resources with direct links to help you achieve your goals while on the beach.
            </p>
            <div className="text-xs text-blue-600 space-y-1">
              <p>• <strong>Udemy Courses:</strong> Direct links to relevant online courses</p>
              <p>• <strong>YouTube Videos:</strong> Educational videos from trusted channels</p>
              <p>• <strong>Books:</strong> Amazon.com links for purchasing recommended books</p>
              <p>• <strong>Papers & Reports:</strong> Free academic papers and industry reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations; 
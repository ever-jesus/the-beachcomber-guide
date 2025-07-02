import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import Recommendations from './pages/Recommendations';
import ActivityLog from './pages/ActivityLog';
import AuthForm from './components/AuthForm';
import { initializeFirebase, getAuthInstance, signOutUser } from './services/firebase';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginMode, setIsLoginMode] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeFirebase();
        const auth = getAuthInstance();
        
        // Listen for auth state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
          setIsAuthenticated(!!user);
          setIsLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSwitchMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <AuthForm 
                onAuthSuccess={handleAuthSuccess} 
                onSwitchMode={handleSwitchMode}
                isLoginMode={isLoginMode}
              />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
              <Dashboard onSignOut={handleSignOut} /> : 
              <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/profile" 
          element={
            isAuthenticated ? 
              <ProfileSetup onSignOut={handleSignOut} /> : 
              <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/recommendations" 
          element={
            isAuthenticated ? 
              <Recommendations onSignOut={handleSignOut} /> : 
              <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/activities" 
          element={
            isAuthenticated ? 
              <ActivityLog onSignOut={handleSignOut} /> : 
              <Navigate to="/" replace />
          } 
        />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;

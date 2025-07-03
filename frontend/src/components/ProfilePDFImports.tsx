import React, { useState, useRef } from 'react';
import { getCurrentUser } from '../services/firebase';

interface ProfilePDFImportsProps {
  onImportSuccess: (data: any, profileType: string) => void;
  onImportError: (error: string) => void;
  importHistory: any;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const ProfilePDFImports: React.FC<ProfilePDFImportsProps> = ({ 
  onImportSuccess, 
  onImportError, 
  importHistory 
}) => {
  const [uploadingProfile, setUploadingProfile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({
    jigsaw: null,
    pathways: null,
    workday: null
  });

  const fileInputRefs = {
    jigsaw: useRef<HTMLInputElement>(null),
    pathways: useRef<HTMLInputElement>(null),
    workday: useRef<HTMLInputElement>(null)
  };

  const profileConfigs = {
    jigsaw: {
      title: 'Jigsaw Profile',
      description: 'Upload your Jigsaw PDF to import your Thoughtworks profile data',
      color: 'blue',
      icon: '🧩'
    },
    pathways: {
      title: 'Pathways Profile',
      description: 'Upload your Pathways PDF to import your career development data',
      color: 'purple',
      icon: '🛤️'
    },
    workday: {
      title: 'Workday Profile',
      description: 'Upload your Workday PDF to import your HR system data',
      color: 'green',
      icon: '💼'
    }
  };

  const handleFileSelect = (profileType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        onImportError('Please select a PDF file.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        onImportError('File size must be less than 10MB.');
        return;
      }
      setSelectedFiles(prev => ({
        ...prev,
        [profileType]: file
      }));
    }
  };

  const handleUpload = async (profileType: string) => {
    const file = selectedFiles[profileType];
    if (!file) {
      onImportError('Please select a file first.');
      return;
    }

    setUploadingProfile(profileType);
    setUploadProgress(0);

    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('Authentication token not found.');
      }

      const idToken = await currentUser.getIdToken();
      if (!idToken) {
        throw new Error('Authentication token not found.');
      }

      const formData = new FormData();
      formData.append('pdf', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`${API_BASE_URL}/api/pdf-import/import/${profileType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload PDF');
      }

      const result = await response.json();
      onImportSuccess(result, profileType);
      
      // Reset form for this profile type
      setSelectedFiles(prev => ({
        ...prev,
        [profileType]: null
      }));
      if (fileInputRefs[profileType as keyof typeof fileInputRefs].current) {
        fileInputRefs[profileType as keyof typeof fileInputRefs].current!.value = '';
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      onImportError(error instanceof Error ? error.message : 'Failed to upload PDF');
    } finally {
      setUploadingProfile(null);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (profileType: string, event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        onImportError('Please select a PDF file.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        onImportError('File size must be less than 10MB.');
        return;
      }
      setSelectedFiles(prev => ({
        ...prev,
        [profileType]: file
      }));
    }
  };

  const getColorClasses = (profileType: string) => {
    const config = profileConfigs[profileType as keyof typeof profileConfigs];
    const colorMap = {
      blue: {
        border: 'border-blue-300 hover:border-blue-400',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      purple: {
        border: 'border-purple-300 hover:border-purple-400',
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      green: {
        border: 'border-green-300 hover:border-green-400',
        bg: 'bg-green-50',
        text: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700'
      }
    };
    return colorMap[config.color as keyof typeof colorMap];
  };

  return (
    <div className="space-y-6">
      {Object.entries(profileConfigs).map(([profileType, config]) => {
        const colors = getColorClasses(profileType);
        const selectedFile = selectedFiles[profileType];
        const isUploading = uploadingProfile === profileType;
        const hasHistory = importHistory?.[profileType]?.hasImportedData;

        return (
          <div key={profileType} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{config.title}</h3>
                  <p className="text-sm text-gray-600">{config.description}</p>
                </div>
              </div>
              {hasHistory && (
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                  Imported
                </div>
              )}
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                selectedFile
                  ? `${colors.border} ${colors.bg}`
                  : `border-gray-300 hover:${colors.border} hover:${colors.bg}`
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(profileType, e)}
              onClick={() => fileInputRefs[profileType as keyof typeof fileInputRefs].current?.click()}
            >
              <input
                ref={fileInputRefs[profileType as keyof typeof fileInputRefs]}
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileSelect(profileType, e)}
                className="hidden"
              />
              
              {selectedFile ? (
                <div>
                  <div className={`${colors.text} mb-2`}>
                    <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-gray-400 mb-2">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    Click to select or drag and drop your PDF here
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Max 10MB
                  </p>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${colors.button} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 space-y-2">
              {selectedFile && !isUploading && (
                <button
                  onClick={() => handleUpload(profileType)}
                  className={`w-full ${colors.button} text-white py-2 px-4 rounded-md focus:outline-none focus:shadow-outline font-semibold transition-colors`}
                >
                  Import {config.title}
                </button>
              )}
              
              {selectedFile && !isUploading && (
                <button
                  onClick={() => {
                    setSelectedFiles(prev => ({
                      ...prev,
                      [profileType]: null
                    }));
                    if (fileInputRefs[profileType as keyof typeof fileInputRefs].current) {
                      fileInputRefs[profileType as keyof typeof fileInputRefs].current!.value = '';
                    }
                  }}
                  className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:shadow-outline-gray font-semibold transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {/* Import History */}
            {hasHistory && (
              <div className={`mt-4 p-3 ${colors.bg} rounded-lg`}>
                <p className="text-sm text-gray-800">
                  Last imported: {importHistory[profileType].importSource} 
                  {importHistory[profileType].lastImported && (
                    <span className="text-gray-600 ml-2">
                      ({new Date(importHistory[profileType].lastImported).toLocaleDateString()})
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProfilePDFImports; 
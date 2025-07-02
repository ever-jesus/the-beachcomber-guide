import * as admin from 'firebase-admin';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;

/**
 * Initializes Firebase Admin SDK.
 * This function should be called once at the backend startup.
 */
export const initializeFirebaseAdmin = () => {
  try {
    // Use the service account JSON file
    const serviceAccountPath = path.join(__dirname, '../../firebase-service-account.json');
    
    // Check if Firebase app is already initialized to avoid re-initialization errors
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
        // You might need to add other config like databaseURL if using Realtime Database
      });
      console.log("Firebase Admin SDK initialized successfully.");
    }

    db = admin.firestore();
    auth = admin.auth();

  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    // Exit the process if Firebase Admin SDK fails to initialize
    process.exit(1);
  }
};

/**
 * Returns the Firestore Admin SDK instance.
 * @returns {admin.firestore.Firestore} The Firestore Admin SDK instance.
 */
export const getDbAdmin = () => {
  if (!db) {
    console.error("Firestore Admin SDK not initialized. Call initializeFirebaseAdmin first.");
    throw new Error("Firestore Admin SDK not initialized.");
  }
  return db;
};

/**
 * Returns the Firebase Auth Admin SDK instance.
 * @returns {admin.auth.Auth} The Auth Admin SDK instance.
 */
export const getAuthAdmin = () => {
  if (!auth) {
    console.error("Auth Admin SDK not initialized. Call initializeFirebaseAdmin first.");
    throw new Error("Auth Admin SDK not initialized.");
  }
  return auth;
}; 
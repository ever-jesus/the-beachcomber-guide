// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCN6TPHGCOAcrzyQhj64i4H4HjHxKlkWt8",
  authDomain: "the-beachcomber-guide.firebaseapp.com",
  projectId: "the-beachcomber-guide",
  storageBucket: "the-beachcomber-guide.firebasestorage.app",
  messagingSenderId: "28338742421",
  appId: "1:28338742421:web:74ab634ec3c4de2d8ea79c",
  measurementId: "G-TKV310ERVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize other Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
let currentUserId: string | null = null; // To store the authenticated user ID
let mockCurrentUser: User | null = null; // To store the mock current user

// Mock authentication for development
const MOCK_AUTH_ENABLED = false; // Set to false to use real Firebase Auth

// Predefined mock users for development
const MOCK_USERS = new Map<string, { 
  email: string; 
  password: string; 
  displayName: string;
  role: string;
  uid: string;
}>();

// Initialize mock users
const initializeMockUsers = () => {
  // Thoughtworks Consultant
  MOCK_USERS.set('consultant@thoughtworks.com', {
    email: 'consultant@thoughtworks.com',
    password: 'consultant123',
    displayName: 'Sarah Johnson',
    role: 'Senior Consultant',
    uid: 'mock-user-consultant-001'
  });

  // Thoughtworks Developer
  MOCK_USERS.set('developer@thoughtworks.com', {
    email: 'developer@thoughtworks.com',
    password: 'developer123',
    displayName: 'Alex Chen',
    role: 'Software Developer',
    uid: 'mock-user-developer-002'
  });

  // Thoughtworks Manager
  MOCK_USERS.set('manager@thoughtworks.com', {
    email: 'manager@thoughtworks.com',
    password: 'manager123',
    displayName: 'Michael Rodriguez',
    role: 'Delivery Manager',
    uid: 'mock-user-manager-003'
  });

  // Test User
  MOCK_USERS.set('test@example.com', {
    email: 'test@example.com',
    password: 'test123',
    displayName: 'Test User',
    role: 'Tester',
    uid: 'mock-user-test-004'
  });

  // Demo User
  MOCK_USERS.set('demo@thoughtworks.com', {
    email: 'demo@thoughtworks.com',
    password: 'demo123',
    displayName: 'Demo User',
    role: 'Demo Account',
    uid: 'mock-user-demo-005'
  });
};

// Initialize mock users on first load
initializeMockUsers();

/**
 * Creates a mock User object
 */
const createMockUser = (email: string, displayName: string, uid: string): User => {
  return {
    uid: uid,
    email: email,
    displayName: displayName,
    photoURL: null,
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: 'mock-refresh-token',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-id-token-for-' + uid,
    getIdTokenResult: async () => ({ 
      claims: {}, 
      authTime: '', 
      issuedAtTime: '', 
      expirationTime: '', 
      signInProvider: null, 
      signInSecondFactor: null, 
      token: 'mock-id-token-for-' + uid 
    }),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
    providerId: 'password'
  } as User;
};

/**
 * Initializes Firebase application and services.
 * This function should be called once when the app starts.
 */
export const initializeFirebase = async () => {
  try {
    if (MOCK_AUTH_ENABLED) {
      // Mock authentication state
      console.log("Mock authentication enabled for development");
      console.log("Available mock users:");
      MOCK_USERS.forEach((user, email) => {
        console.log(`- ${email} (${user.password}) - ${user.displayName} (${user.role})`);
      });
      return;
    }

    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUserId = user.uid;
        console.log("User authenticated:", currentUserId);
      } else {
        currentUserId = null;
        console.log("User logged out or not authenticated.");
      }
    });

    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
};

/**
 * Signs in with Google SSO
 */
export const signInWithGoogle = async (): Promise<User> => {
  if (MOCK_AUTH_ENABLED) {
    // Mock Google sign-in - use a predefined mock user
    const mockUser = createMockUser(
      'google.user@thoughtworks.com',
      'Google User',
      'mock-google-user-' + Date.now()
    );
    
    currentUserId = mockUser.uid;
    mockCurrentUser = mockUser;
    console.log("Mock Google sign-in successful:", mockUser.uid);
    return mockUser;
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

/**
 * Signs up with email and password
 */
export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  if (MOCK_AUTH_ENABLED) {
    // Mock email sign-up
    if (MOCK_USERS.has(email)) {
      throw new Error('An account with this email already exists.');
    }

    // Create new mock user
    const newUid = 'mock-user-' + Date.now();
    const displayName = email.split('@')[0]; // Use email prefix as display name
    const mockUser = createMockUser(email, displayName, newUid);

    // Store new mock user
    MOCK_USERS.set(email, {
      email,
      password,
      displayName: mockUser.displayName || 'New User',
      role: 'New User',
      uid: newUid
    });

    currentUserId = mockUser.uid;
    mockCurrentUser = mockUser;
    console.log("Mock email sign-up successful:", mockUser.uid);
    return mockUser;
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing up with email:", error);
    throw error;
  }
};

/**
 * Signs in with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  if (MOCK_AUTH_ENABLED) {
    // Mock email sign-in
    const userData = MOCK_USERS.get(email);
    if (!userData || userData.password !== password) {
      throw new Error('Invalid email or password.');
    }

    const mockUser = createMockUser(email, userData.displayName, userData.uid);

    currentUserId = mockUser.uid;
    mockCurrentUser = mockUser;
    console.log("Mock email sign-in successful:", mockUser.uid, "as", userData.displayName);
    return mockUser;
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

/**
 * Signs out the current user
 */
export const signOutUser = async (): Promise<void> => {
  if (MOCK_AUTH_ENABLED) {
    // Mock sign-out
    currentUserId = null;
    mockCurrentUser = null;
    console.log("Mock sign-out successful");
    return;
  }

  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Returns the Firestore instance.
 * @returns {Firestore} The Firestore instance.
 */
export const getDb = () => {
  if (!db) {
    console.error("Firestore not initialized. Call initializeFirebase first.");
    throw new Error("Firestore not initialized.");
  }
  return db;
};

/**
 * Returns the Firebase Auth instance.
 * @returns {Auth} The Auth instance.
 */
export const getAuthInstance = () => {
  if (!auth) {
    console.error("Auth not initialized. Call initializeFirebase first.");
    throw new Error("Auth not initialized.");
  }
  return auth;
};

/**
 * Returns the current authenticated user's ID.
 * @returns {string | null} The user ID or null if not authenticated.
 */
export const getUserId = () => {
  return currentUserId;
};

/**
 * Check if mock authentication is enabled
 * @returns {boolean} True if mock auth is enabled
 */
export const isMockAuthEnabled = () => {
  return MOCK_AUTH_ENABLED;
};

/**
 * Get list of available mock users for development
 * @returns {Array} Array of mock user objects
 */
export const getMockUsers = () => {
  if (!MOCK_AUTH_ENABLED) {
    return [];
  }
  
  return Array.from(MOCK_USERS.values()).map(user => ({
    email: user.email,
    password: user.password,
    displayName: user.displayName,
    role: user.role
  }));
};

/**
 * Get the current user (works with both real and mock authentication)
 * @returns {User | null} The current user or null if not authenticated
 */
export const getCurrentUser = (): User | null => {
  if (MOCK_AUTH_ENABLED) {
    return mockCurrentUser;
  }
  return auth.currentUser;
};
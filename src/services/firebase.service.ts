import admin from 'firebase-admin';
import env from '../config/env';

// Initialize Firebase Admin SDK only once
let firebaseApp: admin.app.App | null = null;

const initializeFirebase = (): admin.app.App => {
  if (firebaseApp) {
    return firebaseApp;
  }

  // Validate required credentials
  if (!env.FIREBASE_PROJECT_ID) {
    throw new Error('FIREBASE_PROJECT_ID is required');
  }
  if (!env.FIREBASE_CLIENT_EMAIL) {
    throw new Error('FIREBASE_CLIENT_EMAIL is required');
  }
  if (!env.FIREBASE_PRIVATE_KEY) {
    throw new Error('FIREBASE_PRIVATE_KEY is required');
  }

  // Prepare credentials - replace escaped newlines with actual newlines
  const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

  const serviceAccount = {
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  };

  try {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return firebaseApp;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw new Error('Failed to initialize Firebase Admin SDK');
  }
};

/**
 * Verify Firebase ID token
 * @param idToken - The Firebase ID token from client
 * @returns Decoded token payload
 */
export const verifyIdToken = async (idToken: string): Promise<admin.auth.DecodedIdToken> => {
  const app = initializeFirebase();
  try {
    const decodedToken = await admin.auth(app).verifyIdToken(idToken);
    return decodedToken;
  } catch (error: any) {
    if (error.code === 'auth/user-token-expired' || error.code === 'auth/invalid-id-token') {
      throw new Error('Invalid or expired token');
    }
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

/**
 * Get user by UID from Firebase Auth
 */
export const getUserByUid = async (uid: string): Promise<admin.auth.UserRecord> => {
  const app = initializeFirebase();
  try {
    return await admin.auth(app).getUser(uid);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      throw new Error('User not found in Firebase');
    }
    throw error;
  }
};

/**
 * Create a custom token for a user (optional, for advanced flows)
 */
export const createCustomToken = async (uid: string): Promise<string> => {
  const app = initializeFirebase();
  return await admin.auth(app).createCustomToken(uid);
};

export default {
  verifyIdToken,
  getUserByUid,
  createCustomToken,
};

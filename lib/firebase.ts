import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize App Check with reCAPTCHA v3
if (typeof window !== 'undefined') {
  // Enable debug mode in development
  if (process.env.NODE_ENV === 'development') {
    // @ts-ignore - Firebase App Check debug token
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  // Only initialize App Check once
  try {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    
    if (!siteKey) {
      console.warn('⚠️ NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. App Check will not be initialized.');
    } else {
      const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        
        // Auto-refresh tokens before they expire
        isTokenAutoRefreshEnabled: true
      });
      
      console.log('✅ Firebase App Check initialized with reCAPTCHA v3');
    }
  } catch (error: any) {
    // Ignore if already initialized
    if (error?.code !== 'app-check/already-initialized') {
      console.error('❌ Error initializing App Check:', error);
    }
  }
}

export { app };

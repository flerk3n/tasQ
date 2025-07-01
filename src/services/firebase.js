import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Debug: Test different ways to access env vars
console.log('🔧 Testing environment variable access...');
console.log('🔧 process.env type:', typeof process.env);
console.log('🔧 process.env keys:', Object.keys(process.env));
console.log('🔧 EXPO_PUBLIC keys:', Object.keys(process.env).filter(k => k.startsWith('EXPO_PUBLIC')));

// Try different access methods
const testVar = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
console.log('🔧 Direct access to API key:', testVar);
console.log('🔧 API key length:', testVar ? testVar.length : 'undefined');

// Use hardcoded values since env vars aren't working in web
const firebaseConfig = {
  apiKey: "AIzaSyCEdwSZKDa20_cEfJiE5Hs3SfSFVvops2M",
  authDomain: "tasq-d5a3b.firebaseapp.com",
  projectId: "tasq-d5a3b",
  storageBucket: "tasq-d5a3b.firebasestorage.app",
  messagingSenderId: "864339141476",
  appId: "1:864339141476:web:67d4f2f6622af2479ad071"
};

console.log('🔧 Using hardcoded Firebase config for now');
console.log('🔧 Firebase Config:', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Export GoogleAuthProvider for use in AuthContext
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app; 
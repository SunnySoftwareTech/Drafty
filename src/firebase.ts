import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBrkTLS_W9Z1mVfkyOz6Nf2G0Rdob-x65A',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'drafty-acc4e.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'drafty-acc4e',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'drafty-acc4e.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '601306877958',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:601306877958:web:01c0feda98cccf836f3387',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-Z1XB5J6FJN',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const analytics = getAnalytics(app)
export default app

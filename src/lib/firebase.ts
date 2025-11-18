import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDjVuBLi7ssnvf7ceP9BjhBJp3Hnm-QfKY",
  authDomain: "senseaid-site.firebaseapp.com",
  projectId: "senseaid-site",
  storageBucket: "senseaid-site.firebasestorage.app",
  messagingSenderId: "641115084253",
  appId: "1:641115084253:web:f37aafd72c66ba8b5e1234",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
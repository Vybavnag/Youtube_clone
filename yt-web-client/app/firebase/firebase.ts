import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyC-dQbGC9TkBE-kyXg8dOPKJMX3Mj4I14o",
  authDomain: "yt-clone-3dce6.firebaseapp.com",
  projectId: "yt-clone-3dce6",
  appId: "1:437029731285:web:ba89afbff7fe3b11045b5c"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export const functions = getFunctions();

export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut() {
  return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

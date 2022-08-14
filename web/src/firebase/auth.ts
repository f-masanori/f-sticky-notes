import '@/firebase/auth'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from 'firebase/auth'
import { firebaseApp } from './index'

const provider = new GoogleAuthProvider()
export const auth = getAuth(firebaseApp)

export const signInWithGoogle = () => {
  signInWithRedirect(auth, provider)
}

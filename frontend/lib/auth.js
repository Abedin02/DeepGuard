import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth } from './firebase'

function requireAuth() {
  if (!auth) {
    throw new Error('Firebase auth is not configured on the frontend.')
  }
  return auth
}

const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()

export function loginWithGoogle() {
  return signInWithPopup(requireAuth(), googleProvider)
}

export function loginWithFacebook() {
  return signInWithPopup(requireAuth(), facebookProvider)
}

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(requireAuth(), email, password)
}

export function registerWithEmail(email, password) {
  return createUserWithEmailAndPassword(requireAuth(), email, password)
}

export function sendPasswordReset(email) {
  return sendPasswordResetEmail(requireAuth(), email)
}

export function logout() {
  return signOut(requireAuth())
}

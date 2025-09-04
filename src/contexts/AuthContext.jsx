import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOnboarded, setIsOnboarded] = useState(false)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        // Check if user profile exists and is onboarded
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const profile = userDoc.data()
            setUserProfile(profile)
            setIsOnboarded(profile.isOnboarded || false)
          } else {
            // Create initial user document
            const initialProfile = {
              userId: user.uid,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0] || '',
              createdAt: new Date(),
              isOnboarded: false,
              premiumTierExpiry: null
            }
            await setDoc(doc(db, 'users', user.uid), initialProfile)
            setUserProfile(initialProfile)
            setIsOnboarded(false)
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      } else {
        setCurrentUser(null)
        setUserProfile(null)
        setIsOnboarded(false)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signUp = async (email, password, displayName = '') => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(result.user, { displayName })
      }
      
      return result.user
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const completeOnboarding = async (profileData) => {
    if (!currentUser) return
    
    try {
      const updatedProfile = {
        ...userProfile,
        ...profileData,
        isOnboarded: true,
        onboardedAt: new Date()
      }
      
      await updateDoc(doc(db, 'users', currentUser.uid), updatedProfile)
      setUserProfile(updatedProfile)
      setIsOnboarded(true)
    } catch (error) {
      console.error('Error completing onboarding:', error)
      throw error
    }
  }

  const value = {
    currentUser,
    userProfile,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isOnboarded,
    completeOnboarding,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

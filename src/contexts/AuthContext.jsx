import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOnboarded, setIsOnboarded] = useState(false)

  // Mock authentication for demo
  useEffect(() => {
    const mockUser = {
      uid: 'demo-user-123',
      email: 'demo@fastiflow.com',
      displayName: 'Demo User'
    }
    
    setTimeout(() => {
      setCurrentUser(mockUser)
      setLoading(false)
      // Check if user is onboarded from localStorage
      const onboarded = localStorage.getItem('fastiflow-onboarded')
      setIsOnboarded(!!onboarded)
    }, 1000)
  }, [])

  const signIn = async (email, password) => {
    // Mock sign in
    const mockUser = {
      uid: 'demo-user-123',
      email: email,
      displayName: email.split('@')[0]
    }
    setCurrentUser(mockUser)
    return mockUser
  }

  const signUp = async (email, password) => {
    // Mock sign up
    const mockUser = {
      uid: 'demo-user-123',
      email: email,
      displayName: email.split('@')[0]
    }
    setCurrentUser(mockUser)
    return mockUser
  }

  const signOut = () => {
    setCurrentUser(null)
    setIsOnboarded(false)
    localStorage.removeItem('fastiflow-onboarded')
    localStorage.removeItem('fastiflow-user-profile')
  }

  const completeOnboarding = (profileData) => {
    localStorage.setItem('fastiflow-onboarded', 'true')
    localStorage.setItem('fastiflow-user-profile', JSON.stringify(profileData))
    setIsOnboarded(true)
  }

  const value = {
    currentUser,
    signIn,
    signUp,
    signOut,
    isOnboarded,
    completeOnboarding
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
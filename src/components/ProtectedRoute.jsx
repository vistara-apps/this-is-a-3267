import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { currentUser, isOnboarded } = useAuth()

  if (!currentUser) {
    return <Navigate to="/auth" />
  }

  if (!isOnboarded) {
    return <Navigate to="/onboarding" />
  }

  return children
}
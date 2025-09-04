import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { FastingProvider } from './contexts/FastingContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Timer from './pages/Timer'
import Journal from './pages/Journal'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <FastingProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/timer" element={
            <ProtectedRoute>
              <Layout>
                <Timer />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/journal" element={
            <ProtectedRoute>
              <Layout>
                <Journal />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </FastingProvider>
    </AuthProvider>
  )
}

export default App
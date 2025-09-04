import React, { createContext, useContext, useEffect, useState } from 'react'
import { addHours, differenceInMinutes, addMinutes } from 'date-fns'
import { useAuth } from './AuthContext'
import { fastingLogService, firestoreUtils, userService } from '../services/firestore'
import { openAIService, aiUtils } from '../services/openai'

const FastingContext = createContext()

export function useFasting() {
  return useContext(FastingContext)
}

export function FastingProvider({ children }) {
  const { currentUser, userProfile } = useAuth()
  const [fastingSession, setFastingSession] = useState(null)
  const [fastingSchedule, setFastingSchedule] = useState({
    type: '16:8',
    fastingHours: 16,
    eatingHours: 8,
    startTime: '20:00',
    endTime: '12:00'
  })
  const [fastingHistory, setFastingHistory] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentUser) {
      // Clear data when user logs out
      setFastingSession(null)
      setFastingHistory([])
      setFastingSchedule({
        type: '16:8',
        fastingHours: 16,
        eatingHours: 8,
        startTime: '20:00',
        endTime: '12:00'
      })
      return
    }

    // Load user's fasting schedule from profile
    if (userProfile?.currentFastingSchedule) {
      setFastingSchedule(userProfile.currentFastingSchedule)
    }

    // Load fasting history from Firestore
    loadFastingHistory()

    // Check for active session from localStorage (for session persistence)
    const savedSession = localStorage.getItem(`fastiflow-session-${currentUser.uid}`)
    if (savedSession) {
      const session = JSON.parse(savedSession)
      session.startTime = new Date(session.startTime)
      if (session.endTime) {
        session.endTime = new Date(session.endTime)
      }
      setFastingSession(session)
    }
  }, [currentUser, userProfile])

  const loadFastingHistory = async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      const history = await fastingLogService.getFastingLogs(currentUser.uid)
      setFastingHistory(history)
    } catch (error) {
      console.error('Error loading fasting history:', error)
      setError('Failed to load fasting history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let interval
    if (fastingSession && !fastingSession.endTime) {
      interval = setInterval(() => {
        const now = new Date()
        const plannedEndTime = addHours(fastingSession.startTime, fastingSchedule.fastingHours)
        const remaining = differenceInMinutes(plannedEndTime, now)
        setTimeRemaining(Math.max(0, remaining))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [fastingSession, fastingSchedule])

  const startFasting = async () => {
    if (!currentUser) return

    try {
      const now = new Date()
      const session = {
        id: Date.now().toString(),
        startTime: now,
        endTime: null,
        duration: 0,
        mood: null,
        notes: ''
      }
      
      setFastingSession(session)
      localStorage.setItem(`fastiflow-session-${currentUser.uid}`, JSON.stringify(session))
    } catch (error) {
      console.error('Error starting fasting session:', error)
      setError('Failed to start fasting session')
    }
  }

  const endFasting = async (mood = 3, notes = '') => {
    if (!fastingSession || !currentUser) return

    try {
      setLoading(true)
      const now = new Date()
      const duration = differenceInMinutes(now, fastingSession.startTime)
      
      const completedSession = {
        startTime: firestoreUtils.dateToTimestamp(fastingSession.startTime),
        endTime: firestoreUtils.dateToTimestamp(now),
        duration,
        mood,
        notes
      }

      // Save to Firestore
      await fastingLogService.createFastingLog(currentUser.uid, completedSession)
      
      // Update local state
      setFastingSession(null)
      setTimeRemaining(0)
      
      // Reload history to get the updated data
      await loadFastingHistory()

      // Clear session from localStorage
      localStorage.removeItem(`fastiflow-session-${currentUser.uid}`)
    } catch (error) {
      console.error('Error ending fasting session:', error)
      setError('Failed to save fasting session')
    } finally {
      setLoading(false)
    }
  }

  const updateSchedule = async (newSchedule) => {
    if (!currentUser) return

    try {
      setFastingSchedule(newSchedule)
      
      // Update user profile with new schedule
      if (userProfile) {
        await userService.updateUser(currentUser.uid, {
          currentFastingSchedule: newSchedule
        })
      }
    } catch (error) {
      console.error('Error updating schedule:', error)
      setError('Failed to update schedule')
    }
  }

  const getAIRecommendation = async (profileData) => {
    try {
      if (aiUtils.isConfigured()) {
        const recommendation = await openAIService.generateFastingSchedule(profileData)
        return recommendation.recommendedSchedule
      } else {
        // Fallback to rule-based recommendations
        const recommendations = {
          beginner: { type: '14:10', fastingHours: 14, eatingHours: 10 },
          intermediate: { type: '16:8', fastingHours: 16, eatingHours: 8 },
          advanced: { type: '20:4', fastingHours: 20, eatingHours: 4 }
        }

        const level = profileData.experience || 'beginner'
        return recommendations[level] || recommendations.intermediate
      }
    } catch (error) {
      console.error('Error getting AI recommendation:', error)
      // Return default recommendation
      return { type: '16:8', fastingHours: 16, eatingHours: 8 }
    }
  }

  const deleteFastingLog = async (logId) => {
    if (!currentUser) return

    try {
      setLoading(true)
      await fastingLogService.deleteFastingLog(logId)
      await loadFastingHistory()
    } catch (error) {
      console.error('Error deleting fasting log:', error)
      setError('Failed to delete fasting log')
    } finally {
      setLoading(false)
    }
  }

  const value = {
    fastingSession,
    fastingSchedule,
    fastingHistory,
    timeRemaining,
    loading,
    error,
    startFasting,
    endFasting,
    updateSchedule,
    getAIRecommendation,
    deleteFastingLog,
    loadFastingHistory
  }

  return (
    <FastingContext.Provider value={value}>
      {children}
    </FastingContext.Provider>
  )
}

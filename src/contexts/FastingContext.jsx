import React, { createContext, useContext, useEffect, useState } from 'react'
import { addHours, differenceInMinutes, addMinutes } from 'date-fns'

const FastingContext = createContext()

export function useFasting() {
  return useContext(FastingContext)
}

export function FastingProvider({ children }) {
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

  useEffect(() => {
    // Load fasting data from localStorage
    const savedSession = localStorage.getItem('fastiflow-session')
    const savedHistory = localStorage.getItem('fastiflow-history')
    const savedSchedule = localStorage.getItem('fastiflow-schedule')

    if (savedSession) {
      const session = JSON.parse(savedSession)
      session.startTime = new Date(session.startTime)
      if (session.endTime) {
        session.endTime = new Date(session.endTime)
      }
      setFastingSession(session)
    }

    if (savedHistory) {
      setFastingHistory(JSON.parse(savedHistory))
    }

    if (savedSchedule) {
      setFastingSchedule(JSON.parse(savedSchedule))
    }
  }, [])

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

  const startFasting = () => {
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
    localStorage.setItem('fastiflow-session', JSON.stringify(session))
  }

  const endFasting = (mood = 3, notes = '') => {
    if (!fastingSession) return

    const now = new Date()
    const duration = differenceInMinutes(now, fastingSession.startTime)
    
    const completedSession = {
      ...fastingSession,
      endTime: now,
      duration,
      mood,
      notes
    }

    const updatedHistory = [completedSession, ...fastingHistory]
    setFastingHistory(updatedHistory)
    setFastingSession(null)
    setTimeRemaining(0)

    localStorage.setItem('fastiflow-history', JSON.stringify(updatedHistory))
    localStorage.removeItem('fastiflow-session')
  }

  const updateSchedule = (newSchedule) => {
    setFastingSchedule(newSchedule)
    localStorage.setItem('fastiflow-schedule', JSON.stringify(newSchedule))
  }

  const getAIRecommendation = async (userProfile) => {
    // Mock AI recommendation based on user profile
    const recommendations = {
      beginner: { type: '14:10', fastingHours: 14, eatingHours: 10 },
      intermediate: { type: '16:8', fastingHours: 16, eatingHours: 8 },
      advanced: { type: '20:4', fastingHours: 20, eatingHours: 4 }
    }

    const level = userProfile.experience || 'beginner'
    return recommendations[level] || recommendations.intermediate
  }

  const value = {
    fastingSession,
    fastingSchedule,
    fastingHistory,
    timeRemaining,
    startFasting,
    endFasting,
    updateSchedule,
    getAIRecommendation
  }

  return (
    <FastingContext.Provider value={value}>
      {children}
    </FastingContext.Provider>
  )
}
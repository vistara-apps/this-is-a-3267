import React, { useState } from 'react'
import { useFasting } from '../contexts/FastingContext'
import { Play, Pause, Square, Clock, Target, Zap, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import FastingTimer from '../components/FastingTimer'

export default function Timer() {
  const { 
    fastingSession, 
    fastingSchedule, 
    startFasting, 
    endFasting, 
    timeRemaining 
  } = useFasting()
  
  const [mood, setMood] = useState(3)
  const [notes, setNotes] = useState('')

  const isActiveFasting = fastingSession && !fastingSession.endTime

  const handleStartFasting = () => {
    startFasting()
  }

  const handleEndFasting = () => {
    endFasting(mood, notes)
    setMood(3)
    setNotes('')
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="section-spacing pb-20 lg:pb-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="heading-1 mb-4">Fasting Timer</h1>
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-surface rounded-lg border border-border">
          <Zap className="h-4 w-4 text-accent" />
          <span className="body-small">
            Current Schedule: <span className="text-accent font-medium">{fastingSchedule.type}</span>
          </span>
        </div>
      </motion.div>

      {/* Main Timer Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Timer Display */}
        <motion.div 
          className="card text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <FastingTimer large={true} />
          
          {/* Timer Controls */}
          <div className="mt-8 space-y-4">
            {!isActiveFasting ? (
              <motion.button
                onClick={handleStartFasting}
                className="w-full btn-accent flex items-center justify-center space-x-3 text-lg py-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Play className="h-6 w-6" />
                <span>Start Fasting</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={handleEndFasting}
                className="w-full bg-error hover:bg-error/90 text-white px-6 py-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3 text-lg shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Square className="h-6 w-6" />
                <span>End Fast</span>
              </motion.button>
            )}
          </div>

          {/* Schedule Info */}
          <div className="mt-6 p-4 bg-surface-elevated rounded-lg border border-border-light">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Fasting Window:</span>
              <span className="font-semibold text-accent">{fastingSchedule.fastingHours} hours</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-3">
              <span className="text-muted">Eating Window:</span>
              <span className="font-semibold text-primary">{fastingSchedule.eatingHours} hours</span>
            </div>
          </div>
        </motion.div>

        {/* Session Details */}
        <div className="space-y-6">
          {/* Current Session Info */}
          {isActiveFasting && (
            <motion.div 
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="heading-3 mb-6 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-accent" />
                Current Session
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-surface-elevated rounded-lg">
                  <span className="text-muted">Started:</span>
                  <span className="font-medium">{new Date(fastingSession.startTime).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-accent-subtle rounded-lg">
                  <span className="text-muted">Time Remaining:</span>
                  <span className="text-accent font-bold text-lg">{formatTime(timeRemaining)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface-elevated rounded-lg">
                  <span className="text-muted">Target Duration:</span>
                  <span className="font-medium">{fastingSchedule.fastingHours} hours</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* End Session Form */}
          {isActiveFasting && (
            <motion.div 
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="heading-3 mb-6">How are you feeling?</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-text-secondary">Mood Rating</label>
                  <div className="flex space-x-3">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <motion.button
                        key={rating}
                        onClick={() => setMood(rating)}
                        className={`w-12 h-12 rounded-full border-2 font-semibold transition-all ${
                          mood === rating
                            ? 'border-accent bg-accent text-bg shadow-glow'
                            : 'border-border hover:border-accent/50 hover:bg-accent/10'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        {rating}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted mt-2">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-text-secondary">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How did this fast feel? Any challenges or wins?"
                    className="input-primary"
                    rows={4}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Next Fast Recommendation */}
          {!isActiveFasting && (
            <motion.div 
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="heading-3 mb-6 flex items-center">
                <Target className="h-5 w-5 mr-2 text-accent" />
                AI Recommendation
              </h3>
              <div className="p-4 bg-primary-subtle border border-primary/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm mb-2 text-text">
                      Based on your recent progress, we recommend starting your next fast at{' '}
                      <span className="font-semibold text-primary">{fastingSchedule.startTime}</span>.
                    </p>
                    <p className="text-xs text-muted">
                      This aligns with your sleep schedule and maximizes the benefits of your {fastingSchedule.type} routine.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

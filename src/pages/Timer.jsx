import React, { useState } from 'react'
import { useFasting } from '../contexts/FastingContext'
import { Play, Pause, Square, Clock, Target } from 'lucide-react'
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Fasting Timer</h1>
        <p className="text-muted">
          Current Schedule: <span className="text-accent font-medium">{fastingSchedule.type}</span>
        </p>
      </div>

      {/* Main Timer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timer Display */}
        <div className="card text-center">
          <FastingTimer large={true} />
          
          {/* Timer Controls */}
          <div className="mt-8 space-y-4">
            {!isActiveFasting ? (
              <button
                onClick={handleStartFasting}
                className="w-full btn-primary flex items-center justify-center space-x-2 text-lg py-4"
              >
                <Play className="h-6 w-6" />
                <span>Start Fasting</span>
              </button>
            ) : (
              <button
                onClick={handleEndFasting}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-lg"
              >
                <Square className="h-6 w-6" />
                <span>End Fast</span>
              </button>
            )}
          </div>

          {/* Schedule Info */}
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Fasting Window:</span>
              <span className="font-medium">{fastingSchedule.fastingHours} hours</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted">Eating Window:</span>
              <span className="font-medium">{fastingSchedule.eatingHours} hours</span>
            </div>
          </div>
        </div>

        {/* Session Details */}
        <div className="space-y-6">
          {/* Current Session Info */}
          {isActiveFasting && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-accent" />
                Current Session
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted">Started:</span>
                  <span>{new Date(fastingSession.startTime).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Time Remaining:</span>
                  <span className="text-accent font-medium">{formatTime(timeRemaining)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Target Duration:</span>
                  <span>{fastingSchedule.fastingHours} hours</span>
                </div>
              </div>
            </div>
          )}

          {/* End Session Form */}
          {isActiveFasting && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">How are you feeling?</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mood (1-5)</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMood(rating)}
                        className={`w-10 h-10 rounded-full border-2 transition-colors ${
                          mood === rating
                            ? 'border-accent bg-accent text-bg'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How did this fast feel? Any challenges or wins?"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Next Fast Recommendation */}
          {!isActiveFasting && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-accent" />
                AI Recommendation
              </h3>
              <div className="p-4 bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-lg">
                <p className="text-sm mb-2">
                  Based on your recent progress, we recommend starting your next fast at{' '}
                  <span className="font-medium text-accent">{fastingSchedule.startTime}</span>.
                </p>
                <p className="text-xs text-muted">
                  This aligns with your sleep schedule and maximizes the benefits of your {fastingSchedule.type} routine.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
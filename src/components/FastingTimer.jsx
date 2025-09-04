import React from 'react'
import { useFasting } from '../contexts/FastingContext'
import { Clock, Target } from 'lucide-react'

export default function FastingTimer({ large = false }) {
  const { fastingSession, fastingSchedule, timeRemaining } = useFasting()

  const isActiveFasting = fastingSession && !fastingSession.endTime

  const formatTime = (minutes) => {
    const hours = Math.floor(Math.abs(minutes) / 60)
    const mins = Math.abs(minutes) % 60
    const sign = minutes < 0 ? '-' : ''
    return `${sign}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    if (!isActiveFasting) return 0
    const totalMinutes = fastingSchedule.fastingHours * 60
    const elapsedMinutes = totalMinutes - timeRemaining
    return Math.min(100, Math.max(0, (elapsedMinutes / totalMinutes) * 100))
  }

  const progress = getProgress()
  const circumference = 2 * Math.PI * (large ? 120 : 80)
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const timerSize = large ? 'w-80 h-80' : 'w-48 h-48'
  const textSize = large ? 'text-4xl' : 'text-2xl'
  const radius = large ? 120 : 80

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Circular Timer */}
      <div className={`relative ${timerSize}`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-700"
          />
          
          {/* Progress circle */}
          {isActiveFasting && (
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-accent transition-all duration-1000 ease-out"
            />
          )}
        </svg>
        
        {/* Timer content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isActiveFasting ? (
            <>
              <div className={`font-bold ${textSize} text-accent`}>
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-muted mt-1">
                {timeRemaining > 0 ? 'remaining' : 'overtime'}
              </div>
              <div className="text-xs text-muted mt-2">
                {Math.round(progress)}% complete
              </div>
            </>
          ) : (
            <>
              <Clock className={`${large ? 'h-12 w-12' : 'h-8 w-8'} text-muted mb-2`} />
              <div className="text-sm text-muted text-center">
                Ready to start
                <br />
                {fastingSchedule.type} fast
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fast Status */}
      <div className="text-center">
        {isActiveFasting ? (
          <div className="flex items-center space-x-2 text-accent">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Fasting Active</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-muted">
            <Target className="h-4 w-4" />
            <span className="text-sm">Next fast: {fastingSchedule.type}</span>
          </div>
        )}
      </div>
    </div>
  )
}
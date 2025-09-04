import React from 'react'
import { useFasting } from '../contexts/FastingContext'
import { Clock, Target, Zap, Award, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

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

  const getMotivationalMessage = (progress) => {
    if (progress < 25) return "Great start! You've got this! 💪"
    if (progress < 50) return "You're doing amazing! Keep going! 🔥"
    if (progress < 75) return "More than halfway there! 🚀"
    if (progress < 90) return "Almost there! You're crushing it! ⭐"
    return "Final stretch! You're incredible! 🏆"
  }

  const progress = getProgress()
  const circumference = 2 * Math.PI * (large ? 120 : 80)
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Responsive sizing
  const timerSize = large 
    ? 'w-64 h-64 sm:w-80 sm:h-80' 
    : 'w-40 h-40 sm:w-48 sm:h-48'
  const textSize = large 
    ? 'text-2xl sm:text-3xl lg:text-4xl' 
    : 'text-lg sm:text-xl lg:text-2xl'
  const radius = large ? 120 : 80

  const isOvertime = timeRemaining < 0
  const progressColor = isOvertime ? 'text-warning' : 'text-accent'

  return (
    <motion.div 
      className="flex flex-col items-center space-y-4 sm:space-y-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Circular Timer */}
      <div className={`relative ${timerSize}`}>
        {/* Glow effect for active fasting */}
        {isActiveFasting && (
          <div className="absolute inset-0 rounded-full bg-accent/10 blur-xl animate-pulse-slow" />
        )}
        
        <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-border opacity-30"
          />
          
          {/* Progress circle */}
          {isActiveFasting && (
            <motion.circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`${progressColor} drop-shadow-glow`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}

          {/* Milestone markers */}
          {isActiveFasting && [25, 50, 75].map((milestone) => {
            const angle = (milestone / 100) * 360 - 90
            const x = 100 + (radius - 15) * Math.cos((angle * Math.PI) / 180)
            const y = 100 + (radius - 15) * Math.sin((angle * Math.PI) / 180)
            const isPassed = progress >= milestone
            
            return (
              <motion.circle
                key={milestone}
                cx={x}
                cy={y}
                r="3"
                fill="currentColor"
                className={isPassed ? 'text-accent' : 'text-border'}
                initial={{ scale: 0 }}
                animate={{ scale: isPassed ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
              />
            )
          })}
        </svg>
        
        {/* Timer content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          {isActiveFasting ? (
            <motion.div 
              className="text-center"
              key={timeRemaining} // Re-animate when time changes
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`font-bold ${textSize} ${progressColor} mb-1`}>
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs sm:text-sm text-muted-light mb-2">
                {isOvertime ? 'overtime' : 'remaining'}
              </div>
              <div className="text-xs text-muted flex items-center justify-center space-x-1">
                <TrendingUp className="h-3 w-3" />
                <span>{Math.round(progress)}% complete</span>
              </div>
              
              {/* Progress milestones */}
              {progress > 0 && progress % 25 === 0 && progress < 100 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2"
                >
                  <Award className="h-4 w-4 text-accent mx-auto" />
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Clock className={`${large ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-6 w-6 sm:h-8 sm:w-8'} text-muted mb-3 mx-auto`} />
              <div className="text-xs sm:text-sm text-muted text-center leading-relaxed">
                Ready to start
                <br />
                <span className="text-accent font-medium">{fastingSchedule.type}</span> fast
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Fast Status & Motivation */}
      <div className="text-center space-y-2">
        {isActiveFasting ? (
          <>
            <motion.div 
              className="status-active"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="status-dot-active"></div>
              <span className="text-sm font-medium">Fasting Active</span>
              <Zap className="h-4 w-4 ml-1" />
            </motion.div>
            
            {/* Motivational message */}
            {large && progress > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="px-4 py-2 bg-accent-subtle rounded-lg"
              >
                <p className="text-xs sm:text-sm text-accent-light font-medium">
                  {getMotivationalMessage(progress)}
                </p>
              </motion.div>
            )}
          </>
        ) : (
          <div className="status-inactive">
            <Target className="h-4 w-4" />
            <span className="text-sm">Next fast: {fastingSchedule.type}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

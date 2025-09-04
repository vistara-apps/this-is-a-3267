import React from 'react'
import { useFasting } from '../contexts/FastingContext'
import { Link } from 'react-router-dom'
import { 
  Clock, 
  TrendingUp, 
  Calendar, 
  Target,
  Play,
  Pause,
  MessageCircle,
  Award,
  Flame,
  BarChart3,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import ProgressChart from '../components/ProgressChart'
import FastingTimer from '../components/FastingTimer'
import AIChatInterface from '../components/AIChatInterface'

export default function Dashboard() {
  const { fastingSession, fastingHistory, fastingSchedule, timeRemaining } = useFasting()

  const currentWeekStats = {
    totalHours: 98.5,
    avgDuration: 16.2,
    completedFasts: 6,
    streakDays: 14
  }

  const isActiveFasting = fastingSession && !fastingSession.endTime

  const statsCards = [
    {
      title: 'This Week',
      value: `${currentWeekStats.totalHours}h`,
      icon: BarChart3,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      description: 'Total fasting time'
    },
    {
      title: 'Avg Duration',
      value: `${currentWeekStats.avgDuration}h`,
      icon: Clock,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Per session'
    },
    {
      title: 'Completed',
      value: currentWeekStats.completedFasts,
      icon: Award,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      description: 'Successful fasts'
    },
    {
      title: 'Day Streak',
      value: currentWeekStats.streakDays,
      icon: Flame,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: 'Current streak'
    }
  ]

  return (
    <div className="section-spacing pb-20 lg:pb-8">
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="heading-1">Dashboard</h1>
          <p className="body-large mt-2">Welcome back! Here's your fasting overview.</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-surface rounded-lg border border-border">
          <Zap className="h-4 w-4 text-accent" />
          <span className="body-small">
            Current Plan: <span className="text-accent font-medium">{fastingSchedule.type}</span>
          </span>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        className="grid-responsive-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              className="card-interactive text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
            >
              <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-3`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`text-2xl sm:text-3xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="heading-3 text-sm mb-1">{stat.title}</div>
              <div className="body-small">{stat.description}</div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Timer Section - Full width on mobile, left column on desktop */}
        <motion.div 
          className="xl:col-span-1 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Fasting Timer */}
          <div className="card">
            <h3 className="heading-3 mb-6 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-accent" />
              Fasting Timer
            </h3>
            <FastingTimer />
            <div className="mt-6">
              <Link
                to="/timer"
                className={`w-full flex items-center justify-center space-x-2 ${
                  isActiveFasting ? 'btn-secondary' : 'btn-accent'
                }`}
              >
                {isActiveFasting ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isActiveFasting ? 'Manage Fast' : 'Start Fasting'}</span>
              </Link>
            </div>
          </div>

          {/* AI Check-in - Hidden on mobile, shown on larger screens */}
          <div className="hidden sm:block card">
            <h3 className="heading-3 mb-4 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-accent" />
              Daily AI Check-in
            </h3>
            <AIChatInterface compact={true} />
          </div>
        </motion.div>

        {/* Stats & Progress Section */}
        <motion.div 
          className="xl:col-span-2 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Progress Chart */}
          <div className="card">
            <h3 className="heading-3 mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-accent" />
              Fasting Progress
            </h3>
            <ProgressChart />
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="heading-3 mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-accent" />
              Recent Sessions
            </h3>
            <div className="space-y-3">
              {fastingHistory.slice(0, 5).map((session, index) => (
                <motion.div 
                  key={session.id || index} 
                  className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-light hover:border-accent/30 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-text">
                      {Math.floor(session.duration / 60)}h {session.duration % 60}m
                    </div>
                    <div className="body-small mt-1">
                      {session.endTime ? new Date(session.endTime).toLocaleDateString() : 'In progress'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="body-small">Mood</div>
                      <div className="flex space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`w-2 h-2 rounded-full ${
                              star <= (session.mood || 3) ? 'bg-accent' : 'bg-border'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse-slow"></div>
                  </div>
                </motion.div>
              ))}
              {fastingHistory.length === 0 && (
                <motion.div 
                  className="text-center text-muted py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Target className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="body-large mb-2">Ready to start your journey?</p>
                  <p className="body-small">Your first fast will appear here!</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile AI Check-in - Only shown on mobile */}
      <motion.div 
        className="sm:hidden card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="heading-3 mb-4 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2 text-accent" />
          Daily AI Check-in
        </h3>
        <AIChatInterface compact={true} />
      </motion.div>
    </div>
  )
}

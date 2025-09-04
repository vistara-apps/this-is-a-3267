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
  MessageCircle
} from 'lucide-react'
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted mt-1">Welcome back! Here's your fasting overview.</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted">
            Current Plan: <span className="text-accent font-medium">{fastingSchedule.type}</span>
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Timer & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Fasting Timer */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-accent" />
              Fasting Timer
            </h3>
            <FastingTimer />
            <div className="mt-6">
              <Link
                to="/timer"
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                {isActiveFasting ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isActiveFasting ? 'Manage Fast' : 'Start Fasting'}</span>
              </Link>
            </div>
          </div>

          {/* AI Check-in */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-accent" />
              Daily AI Check-in
            </h3>
            <AIChatInterface compact={true} />
          </div>
        </div>

        {/* Right Column - Stats & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <div className="text-2xl font-bold text-accent">{currentWeekStats.totalHours}h</div>
              <div className="text-sm text-muted">This Week</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-primary">{currentWeekStats.avgDuration}h</div>
              <div className="text-sm text-muted">Avg Duration</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-accent">{currentWeekStats.completedFasts}</div>
              <div className="text-sm text-muted">Completed</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-primary">{currentWeekStats.streakDays}</div>
              <div className="text-sm text-muted">Day Streak</div>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-accent" />
              Real-time Fasting Progress
            </h3>
            <ProgressChart />
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-accent" />
              Recent Fasting Sessions
            </h3>
            <div className="space-y-3">
              {fastingHistory.slice(0, 5).map((session, index) => (
                <div key={session.id || index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium">{Math.floor(session.duration / 60)}h {session.duration % 60}m</div>
                    <div className="text-sm text-muted">
                      {session.endTime ? new Date(session.endTime).toLocaleDateString() : 'In progress'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm">Mood: {session.mood || 3}/5</div>
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                  </div>
                </div>
              ))}
              {fastingHistory.length === 0 && (
                <div className="text-center text-muted py-8">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start your first fast to see your progress here!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
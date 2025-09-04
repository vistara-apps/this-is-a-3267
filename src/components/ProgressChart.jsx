import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ProgressChart() {
  // Mock data for the chart
  const data = [
    { day: 'Mon', hours: 16, mood: 4 },
    { day: 'Tue', hours: 18, mood: 5 },
    { day: 'Wed', hours: 14, mood: 3 },
    { day: 'Thu', hours: 16, mood: 4 },
    { day: 'Fri', hours: 20, mood: 5 },
    { day: 'Sat', hours: 16, mood: 4 },
    { day: 'Sun', hours: 15, mood: 3 },
  ]

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`${label}`}</p>
          <p className="text-accent text-sm">
            {`Hours: ${payload[0].value}`}
          </p>
          <p className="text-primary text-sm">
            {`Mood: ${payload[1].value}/5`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="day" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <Tooltip content={customTooltip} />
          <Bar 
            dataKey="hours" 
            fill="hsl(160 100% 40%)" 
            radius={[4, 4, 0, 0]}
            name="Fasting Hours"
          />
          <Bar 
            dataKey="mood" 
            fill="hsl(210 95% 55%)" 
            radius={[4, 4, 0, 0]}
            name="Mood Rating"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
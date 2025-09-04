import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useFasting } from '../contexts/FastingContext'
import { ChevronRight, ChevronLeft, Target, Clock, User } from 'lucide-react'

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    weight: '',
    goal: '',
    wakeTime: '07:00',
    sleepTime: '23:00',
    experience: 'beginner'
  })
  const { completeOnboarding } = useAuth()
  const { getAIRecommendation, updateSchedule } = useFasting()
  const navigate = useNavigate()

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      completeProfile()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const completeProfile = async () => {
    try {
      const recommendation = await getAIRecommendation(profile)
      updateSchedule(recommendation)
      completeOnboarding(profile)
      navigate('/')
    } catch (error) {
      console.error('Onboarding error:', error)
    }
  }

  const updateProfile = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="card">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i <= step ? 'bg-primary text-white' : 'bg-gray-700 text-muted'
                }`}
              >
                {i}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <User className="h-12 w-12 text-accent mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Tell us about yourself</h2>
                <p className="text-muted">We'll use this to create your personalized fasting plan</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => updateProfile('age', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Enter your age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <select
                    value={profile.gender}
                    onChange={(e) => updateProfile('gender', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => updateProfile('weight', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Enter your weight"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Goals & Schedule */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <Target className="h-12 w-12 text-accent mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">What's your goal?</h2>
                <p className="text-muted">This helps us recommend the right fasting schedule</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Goal</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Weight Loss', 'Health Improvement', 'Discipline', 'Longevity'].map((goal) => (
                      <button
                        key={goal}
                        onClick={() => updateProfile('goal', goal)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          profile.goal === goal
                            ? 'border-primary bg-primary bg-opacity-10 text-primary'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Experience Level</label>
                  <select
                    value={profile.experience}
                    onChange={(e) => updateProfile('experience', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="beginner">Beginner (14:10)</option>
                    <option value="intermediate">Intermediate (16:8)</option>
                    <option value="advanced">Advanced (20:4)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Sleep Schedule */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Your daily schedule</h2>
                <p className="text-muted">We'll align your fasting window with your sleep cycle</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Wake Time</label>
                  <input
                    type="time"
                    value={profile.wakeTime}
                    onChange={(e) => updateProfile('wakeTime', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sleep Time</label>
                  <input
                    type="time"
                    value={profile.sleepTime}
                    onChange={(e) => updateProfile('sleepTime', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center space-x-2 btn-secondary disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 btn-primary"
            >
              <span>{step === 3 ? 'Complete Setup' : 'Next'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
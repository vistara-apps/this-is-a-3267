import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
})

// Fasting-specific prompts
export const FASTING_PROMPTS = {
  scheduleGeneration: (userProfile) => `
You are FastiFlow AI, an expert intermittent fasting coach. Generate a personalized fasting schedule for this user:

User Profile:
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Weight: ${userProfile.weight}kg
- Primary Goal: ${userProfile.goal}
- Wake Time: ${userProfile.wakeTime}
- Sleep Time: ${userProfile.sleepTime}
- Experience Level: ${userProfile.experience || 'beginner'}
- Health Conditions: ${userProfile.healthConditions || 'none'}

Based on this profile, recommend:
1. The best fasting schedule (e.g., 16:8, 14:10, 18:6, OMAD)
2. Optimal eating window times
3. Gradual progression plan if needed
4. Key tips for success

Respond in JSON format:
{
  "recommendedSchedule": {
    "type": "16:8",
    "fastingHours": 16,
    "eatingHours": 8,
    "startTime": "20:00",
    "endTime": "12:00"
  },
  "reasoning": "Brief explanation of why this schedule fits the user",
  "progressionPlan": "How to gradually adapt to this schedule",
  "tips": ["tip1", "tip2", "tip3"]
}
`,

  dailyCheckIn: (userProfile, fastingHistory, currentMood) => `
You are FastiFlow AI, a supportive intermittent fasting coach. The user is checking in for their daily AI guidance.

User Context:
- Current fasting schedule: ${userProfile.currentFastingSchedule?.type || '16:8'}
- Recent fasting performance: ${fastingHistory.slice(0, 3).map(log => `${log.duration}min fast, mood: ${log.mood}/5`).join('; ')}
- Current mood: ${currentMood}/5
- Goals: ${userProfile.goal}

Provide encouraging, personalized advice. Ask about their current state and offer specific, actionable suggestions for today's fast. Keep responses conversational and supportive.
`,

  scheduleAdjustment: (userProfile, recentPerformance, userFeedback) => `
You are FastiFlow AI. The user wants to adjust their fasting schedule based on recent performance.

Current Schedule: ${userProfile.currentFastingSchedule?.type}
Recent Performance: ${recentPerformance}
User Feedback: ${userFeedback}

Suggest schedule modifications and explain the reasoning. Consider:
- Whether to increase/decrease fasting window
- Timing adjustments
- Gradual vs immediate changes
- Potential challenges and solutions

Respond in JSON format with the new schedule recommendation and explanation.
`
}

// OpenAI Service Functions
export const openAIService = {
  // Generate personalized fasting schedule
  async generateFastingSchedule(userProfile) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are FastiFlow AI, an expert intermittent fasting coach. Always respond with helpful, evidence-based advice.'
          },
          {
            role: 'user',
            content: FASTING_PROMPTS.scheduleGeneration(userProfile)
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })

      const content = response.choices[0].message.content
      
      try {
        return JSON.parse(content)
      } catch (parseError) {
        // Fallback if JSON parsing fails
        console.warn('Failed to parse AI response as JSON:', parseError)
        return {
          recommendedSchedule: {
            type: '16:8',
            fastingHours: 16,
            eatingHours: 8,
            startTime: '20:00',
            endTime: '12:00'
          },
          reasoning: content,
          progressionPlan: 'Start gradually and adjust as needed',
          tips: ['Stay hydrated', 'Listen to your body', 'Be consistent']
        }
      }
    } catch (error) {
      console.error('Error generating fasting schedule:', error)
      throw new Error('Failed to generate personalized schedule. Please try again.')
    }
  },

  // Daily AI check-in conversation
  async dailyCheckIn(userProfile, fastingHistory = [], currentMood = 3, conversationHistory = []) {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are FastiFlow AI, a supportive and knowledgeable intermittent fasting coach. Be encouraging, personalized, and provide actionable advice.'
        },
        {
          role: 'user',
          content: FASTING_PROMPTS.dailyCheckIn(userProfile, fastingHistory, currentMood)
        }
      ]

      // Add conversation history
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        })
      })

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0.8,
        max_tokens: 500
      })

      return response.choices[0].message.content
    } catch (error) {
      console.error('Error in daily check-in:', error)
      throw new Error('Unable to connect with AI coach. Please try again.')
    }
  },

  // General chat with AI coach
  async chatWithAI(message, conversationHistory = [], userProfile = null) {
    try {
      const systemPrompt = userProfile 
        ? `You are FastiFlow AI, an expert intermittent fasting coach. The user's current schedule is ${userProfile.currentFastingSchedule?.type || '16:8'} and their goal is ${userProfile.goal || 'general health'}. Provide helpful, personalized fasting advice.`
        : 'You are FastiFlow AI, an expert intermittent fasting coach. Provide helpful, evidence-based advice about intermittent fasting.'

      const messages = [
        {
          role: 'system',
          content: systemPrompt
        }
      ]

      // Add conversation history
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        })
      })

      // Add current message
      messages.push({
        role: 'user',
        content: message
      })

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 600
      })

      return response.choices[0].message.content
    } catch (error) {
      console.error('Error in AI chat:', error)
      throw new Error('Unable to connect with AI coach. Please try again.')
    }
  },

  // Suggest schedule adjustments
  async suggestScheduleAdjustment(userProfile, recentPerformance, userFeedback) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are FastiFlow AI, an expert intermittent fasting coach. Analyze user performance and suggest schedule improvements.'
          },
          {
            role: 'user',
            content: FASTING_PROMPTS.scheduleAdjustment(userProfile, recentPerformance, userFeedback)
          }
        ],
        temperature: 0.6,
        max_tokens: 800
      })

      const content = response.choices[0].message.content
      
      try {
        return JSON.parse(content)
      } catch (parseError) {
        console.warn('Failed to parse schedule adjustment as JSON:', parseError)
        return {
          adjustment: content,
          reasoning: 'Based on your recent performance and feedback'
        }
      }
    } catch (error) {
      console.error('Error suggesting schedule adjustment:', error)
      throw new Error('Unable to generate schedule suggestions. Please try again.')
    }
  },

  // Transcribe audio using Whisper
  async transcribeAudio(audioFile) {
    try {
      const response = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en'
      })

      return response.text
    } catch (error) {
      console.error('Error transcribing audio:', error)
      throw new Error('Failed to transcribe audio. Please try again.')
    }
  },

  // Analyze journal entry for insights
  async analyzeJournalEntry(entryText, userProfile) {
    try {
      const prompt = `
Analyze this fasting journal entry and provide insights:

Journal Entry: "${entryText}"
User's Goal: ${userProfile?.goal || 'general health'}
Current Schedule: ${userProfile?.currentFastingSchedule?.type || '16:8'}

Provide:
1. Mood/sentiment analysis
2. Key themes or concerns
3. Suggestions for improvement
4. Encouragement or validation

Keep response concise and supportive.
`

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are FastiFlow AI, analyzing user journal entries to provide supportive insights and suggestions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      })

      return response.choices[0].message.content
    } catch (error) {
      console.error('Error analyzing journal entry:', error)
      throw new Error('Unable to analyze journal entry. Please try again.')
    }
  }
}

// Utility functions for AI service
export const aiUtils = {
  // Format conversation history for API
  formatConversationHistory(messages) {
    return messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))
  },

  // Extract key metrics from fasting history for AI analysis
  extractPerformanceMetrics(fastingHistory) {
    if (!fastingHistory.length) return 'No recent fasting data'

    const recent = fastingHistory.slice(0, 7) // Last 7 fasts
    const avgDuration = recent.reduce((sum, log) => sum + (log.duration || 0), 0) / recent.length
    const avgMood = recent.filter(log => log.mood).reduce((sum, log, _, arr) => sum + log.mood / arr.length, 0)
    const completionRate = recent.filter(log => log.endTime).length / recent.length

    return `Average duration: ${Math.round(avgDuration)}min, Average mood: ${avgMood.toFixed(1)}/5, Completion rate: ${Math.round(completionRate * 100)}%`
  },

  // Check if API key is configured
  isConfigured() {
    return !!import.meta.env.VITE_OPENAI_API_KEY
  }
}

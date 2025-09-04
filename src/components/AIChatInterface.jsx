import React, { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'

export default function AIChatInterface({ compact = false }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Good morning! How are you feeling about your fasting journey today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')

  const sendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: getAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)

    setInputValue('')
  }

  const getAIResponse = (input) => {
    const responses = [
      "That's great to hear! Remember to stay hydrated during your fast.",
      "It's normal to feel that way. Your body is adapting to the fasting schedule.",
      "Based on your progress, you're doing excellent! Keep up the good work.",
      "Consider adjusting your eating window if you're feeling too restricted.",
      "Your consistency is impressive! The benefits will compound over time."
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Bot className="h-6 w-6 text-accent mt-0.5 flex-shrink-0" />
          <div className="bg-gray-800 rounded-lg p-3 text-sm">
            {messages[messages.length - 1]?.text}
          </div>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="How are you feeling?"
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-sm"
          />
          <button
            onClick={sendMessage}
            className="px-3 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Bot className="h-5 w-5 mr-2 text-accent" />
        AI Coach
      </h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-2 ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {message.sender === 'ai' ? (
              <Bot className="h-6 w-6 text-accent mt-0.5 flex-shrink-0" />
            ) : (
              <User className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
            )}
            <div
              className={`rounded-lg p-3 max-w-xs ${
                message.sender === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-800 text-text'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask your AI coach anything..."
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
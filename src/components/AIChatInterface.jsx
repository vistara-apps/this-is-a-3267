import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response with realistic delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: getAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000) // 1.5-2.5 seconds
  }

  const getAIResponse = (input) => {
    const responses = [
      "That's wonderful to hear! 🌟 Remember to stay hydrated during your fast - water is your best friend.",
      "It's completely normal to feel that way. Your body is adapting beautifully to the fasting schedule. 💪",
      "Based on your progress, you're doing absolutely excellent! Keep up the amazing work! 🚀",
      "Consider adjusting your eating window if you're feeling too restricted. Listen to your body's signals. 🎯",
      "Your consistency is truly impressive! The benefits will compound over time - you're building something great. ✨",
      "That's a great question! Focus on nutrient-dense foods during your eating window for optimal results. 🥗",
      "Remember, every journey has ups and downs. What matters is that you're showing up consistently! 🌈"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickReplies = [
    "How am I doing?",
    "Feeling hungry",
    "Great progress!",
    "Need motivation"
  ]

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Latest AI Message */}
        <motion.div 
          className="flex items-start space-x-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="bg-surface-elevated rounded-lg rounded-tl-sm p-3 text-sm border border-border-light flex-1">
            {messages[messages.length - 1]?.sender === 'ai' 
              ? messages[messages.length - 1]?.text 
              : "How can I help you with your fasting journey today?"
            }
          </div>
        </motion.div>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start space-x-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-surface-elevated rounded-lg rounded-tl-sm p-3 border border-border-light">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="How are you feeling?"
            disabled={isTyping}
            className="input-primary text-sm disabled:opacity-50"
          />
          <motion.button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="btn-accent px-3 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-96 sm:h-[28rem]`}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end space-x-2 max-w-[85%] sm:max-w-xs ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <motion.div 
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' ? 'bg-primary' : 'bg-accent'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </motion.div>
                <motion.div 
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white rounded-br-md' 
                      : 'bg-surface-elevated text-text border border-border-light rounded-bl-md'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className={`text-xs mt-1 opacity-60 ${
                    message.sender === 'user' ? 'text-primary-light' : 'text-muted'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="flex items-end space-x-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="px-4 py-3 bg-surface-elevated rounded-2xl rounded-bl-md border border-border-light">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies - Only show if no recent messages */}
      {messages.length <= 2 && (
        <motion.div 
          className="mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => setInputValue(reply)}
                className="px-3 py-1.5 text-xs bg-surface-hover border border-border rounded-full 
                         text-text-secondary hover:text-text hover:border-accent/50 
                         transition-all duration-200 hover:scale-105"
              >
                {reply}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input */}
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your AI coach anything..."
            disabled={isTyping}
            className="input-primary pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {inputValue && (
            <button
              onClick={() => setInputValue('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-text transition-colors"
            >
              ×
            </button>
          )}
        </div>
        <motion.button
          onClick={sendMessage}
          disabled={!inputValue.trim() || isTyping}
          className="btn-accent px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {isTyping ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </motion.button>
      </div>
    </div>
  )
}

import React from 'react'
import { Loader2 } from 'lucide-react'

// Basic loading spinner component
export default function LoadingSpinner({ 
  size = 'md', 
  color = 'accent', 
  text = null,
  className = '',
  fullScreen = false 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    accent: 'text-accent',
    primary: 'text-primary',
    muted: 'text-muted',
    white: 'text-white'
  }

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
      {text && (
        <p className={`text-sm ${colorClasses[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-bg bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinnerContent}
      </div>
    )
  }

  return spinnerContent
}

// Skeleton loading component for content placeholders
export function SkeletonLoader({ 
  lines = 3, 
  className = '',
  animate = true 
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-surface rounded ${animate ? 'animate-pulse' : ''}`}
          style={{
            width: `${Math.random() * 40 + 60}%` // Random width between 60-100%
          }}
        />
      ))}
    </div>
  )
}

// Card skeleton for loading cards
export function CardSkeleton({ className = '' }) {
  return (
    <div className={`card space-y-4 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-surface rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface rounded animate-pulse w-3/4" />
          <div className="h-3 bg-surface rounded animate-pulse w-1/2" />
        </div>
      </div>
      <SkeletonLoader lines={2} />
    </div>
  )
}

// Button loading state
export function LoadingButton({ 
  children, 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`relative ${className} ${loading ? 'cursor-not-allowed' : ''}`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  )
}

// Progress bar component
export function ProgressBar({ 
  progress = 0, 
  className = '',
  showPercentage = false,
  color = 'accent'
}) {
  const colorClasses = {
    accent: 'bg-accent',
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-muted text-center">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}

// Dots loading animation
export function DotsLoader({ 
  size = 'md',
  color = 'accent',
  className = '' 
}) {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  }

  const colorClasses = {
    accent: 'bg-accent',
    primary: 'bg-primary',
    muted: 'bg-muted'
  }

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  )
}

// Pulse loading animation
export function PulseLoader({ 
  size = 'md',
  color = 'accent',
  className = '' 
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const colorClasses = {
    accent: 'bg-accent',
    primary: 'bg-primary',
    muted: 'bg-muted'
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-ping opacity-20`} />
      <div className={`absolute inset-0 ${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`} />
    </div>
  )
}

// Loading overlay for sections
export function LoadingOverlay({ 
  loading = false, 
  children, 
  text = 'Loading...',
  className = '' 
}) {
  return (
    <div className={`relative ${className}`}>
      {children}
      {loading && (
        <div className="absolute inset-0 bg-bg bg-opacity-80 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <LoadingSpinner text={text} />
        </div>
      )}
    </div>
  )
}

// Lazy loading wrapper
export function LazyLoader({ 
  loading = false, 
  error = null, 
  children,
  fallback = <LoadingSpinner />,
  errorFallback = null 
}) {
  if (error) {
    return errorFallback || (
      <div className="text-center p-4">
        <p className="text-red-400">Failed to load content</p>
      </div>
    )
  }

  if (loading) {
    return fallback
  }

  return children
}

import React, { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Square, Play, Pause, Upload, Trash2, Volume2 } from 'lucide-react'
import { AudioRecorder, audioUtils, audioVisualization } from '../services/audio'
import { openAIService } from '../services/openai'

export default function VoiceRecorder({ 
  onRecordingComplete, 
  onTranscriptionComplete,
  maxDuration = 300, // 5 minutes default
  showTranscription = true,
  showVisualization = true 
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [error, setError] = useState(null)
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [isSupported, setIsSupported] = useState(true)
  
  const recorderRef = useRef(null)
  const audioRef = useRef(null)
  const timerRef = useRef(null)
  const visualizerRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)

  useEffect(() => {
    // Check browser support on mount
    setIsSupported(AudioRecorder.isSupported())
    
    return () => {
      // Cleanup on unmount
      if (recorderRef.current) {
        recorderRef.current.cleanup()
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (visualizerRef.current) {
        cancelAnimationFrame(visualizerRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      setError(null)
      
      if (!recorderRef.current) {
        recorderRef.current = new AudioRecorder()
      }

      await recorderRef.current.startRecording()
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
      setTranscription('')
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          // Auto-stop at max duration
          if (newTime >= maxDuration) {
            stopRecording()
          }
          return newTime
        })
      }, 1000)

      // Setup audio visualization if enabled
      if (showVisualization && recorderRef.current.stream) {
        setupVisualization(recorderRef.current.stream)
      }

    } catch (error) {
      console.error('Error starting recording:', error)
      setError(error.message)
    }
  }

  const stopRecording = async () => {
    try {
      if (!recorderRef.current || !isRecording) return

      const audioBlob = await recorderRef.current.stopRecording()
      setAudioBlob(audioBlob)
      setIsRecording(false)
      setIsPaused(false)
      clearInterval(timerRef.current)
      
      // Stop visualization
      if (visualizerRef.current) {
        cancelAnimationFrame(visualizerRef.current)
      }

      // Validate audio
      try {
        audioUtils.validateAudioSize(audioBlob)
        const duration = await audioUtils.getAudioDuration(audioBlob)
        
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob, {
            duration,
            size: audioBlob.size,
            type: audioBlob.type
          })
        }

        // Auto-transcribe if enabled
        if (showTranscription) {
          await transcribeAudio(audioBlob)
        }

      } catch (validationError) {
        setError(validationError.message)
      }

    } catch (error) {
      console.error('Error stopping recording:', error)
      setError('Failed to stop recording')
    }
  }

  const pauseRecording = () => {
    if (recorderRef.current && isRecording && !isPaused) {
      recorderRef.current.pauseRecording()
      setIsPaused(true)
      clearInterval(timerRef.current)
    }
  }

  const resumeRecording = () => {
    if (recorderRef.current && isRecording && isPaused) {
      recorderRef.current.resumeRecording()
      setIsPaused(false)
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          if (newTime >= maxDuration) {
            stopRecording()
          }
          return newTime
        })
      }, 1000)
    }
  }

  const setupVisualization = (stream) => {
    try {
      audioContextRef.current = audioVisualization.createAudioContext()
      analyserRef.current = audioVisualization.createAnalyser(audioContextRef.current, stream)
      
      const updateVisualization = () => {
        if (isRecording && analyserRef.current) {
          const level = audioVisualization.getVolumeLevel(analyserRef.current)
          setVolumeLevel(level)
          visualizerRef.current = requestAnimationFrame(updateVisualization)
        }
      }
      
      updateVisualization()
    } catch (error) {
      console.warn('Audio visualization not available:', error)
    }
  }

  const transcribeAudio = async (blob) => {
    if (!showTranscription) return

    try {
      setIsTranscribing(true)
      setError(null)
      
      const audioFile = audioUtils.blobToFile(blob, 'recording.webm')
      const transcriptionText = await openAIService.transcribeAudio(audioFile)
      
      setTranscription(transcriptionText)
      
      if (onTranscriptionComplete) {
        onTranscriptionComplete(transcriptionText, blob)
      }
      
    } catch (error) {
      console.error('Error transcribing audio:', error)
      setError('Failed to transcribe audio. You can still save the recording.')
    } finally {
      setIsTranscribing(false)
    }
  }

  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        const audioUrl = audioUtils.createAudioURL(audioBlob)
        audioRef.current.src = audioUrl
        audioRef.current.play()
        setIsPlaying(true)
        
        // Clean up URL when playback ends
        audioRef.current.onended = () => {
          setIsPlaying(false)
          audioUtils.revokeAudioURL(audioUrl)
        }
      }
    }
  }

  const saveRecording = () => {
    if (audioBlob) {
      if (onRecordingComplete) {
        onRecordingComplete(audioBlob, transcription)
      }
      clearRecording()
    }
  }

  const clearRecording = () => {
    setAudioBlob(null)
    setRecordingTime(0)
    setIsPlaying(false)
    setTranscription('')
    setError(null)
  }

  const retryTranscription = async () => {
    if (audioBlob) {
      await transcribeAudio(audioBlob)
    }
  }

  const formatTime = (seconds) => {
    return audioUtils.formatDuration(seconds)
  }

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-900 bg-opacity-20 border border-yellow-500 border-opacity-30 rounded-lg">
        <p className="text-yellow-400 text-center">
          Voice recording is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-900 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Recording Status */}
      {isRecording && (
        <div className="flex items-center justify-center space-x-2 p-3 bg-red-900 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-400 font-medium">
            {isPaused ? 'Paused' : 'Recording'}: {formatTime(recordingTime)}
            {maxDuration && ` / ${formatTime(maxDuration)}`}
          </span>
        </div>
      )}

      {/* Audio Visualization */}
      {showVisualization && isRecording && (
        <div className="flex items-center justify-center space-x-2 p-3 bg-surface rounded-lg">
          <Volume2 className="w-4 h-4 text-muted" />
          <div className="flex-1 bg-muted bg-opacity-20 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-100 ease-out"
              style={{ width: `${volumeLevel * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted">{Math.round(volumeLevel * 100)}%</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col items-center space-y-4">
        {!audioBlob ? (
          // Recording controls
          <div className="flex items-center space-x-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-accent hover:bg-opacity-90'
              }`}
            >
              {isRecording ? (
                <Square className="h-8 w-8 text-white" />
              ) : (
                <Mic className="h-8 w-8 text-bg" />
              )}
            </button>

            {/* Pause/Resume button during recording */}
            {isRecording && (
              <button
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="w-12 h-12 rounded-full bg-yellow-600 hover:bg-yellow-700 transition-colors flex items-center justify-center"
              >
                {isPaused ? (
                  <Play className="h-6 w-6 text-white" />
                ) : (
                  <Pause className="h-6 w-6 text-white" />
                )}
              </button>
            )}
          </div>
        ) : (
          // Playback and save controls
          <div className="flex items-center space-x-4">
            <button
              onClick={playRecording}
              className="w-12 h-12 rounded-full bg-primary hover:bg-opacity-90 transition-colors flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white" />
              )}
            </button>
            
            <button
              onClick={saveRecording}
              disabled={isTranscribing}
              className="px-4 py-2 btn-primary disabled:opacity-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Save Entry
            </button>
            
            <button
              onClick={clearRecording}
              className="px-4 py-2 btn-secondary"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Discard
            </button>
          </div>
        )}

        {/* Instructions */}
        <p className="text-sm text-muted text-center">
          {!audioBlob 
            ? (isRecording 
                ? (isPaused ? 'Recording paused - click resume to continue' : 'Click stop when finished recording')
                : 'Click the microphone to start recording')
            : 'Listen to your recording and save or discard'
          }
        </p>
      </div>

      {/* Transcription Section */}
      {showTranscription && audioBlob && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Transcription</h4>
            {error && !transcription && (
              <button
                onClick={retryTranscription}
                className="text-xs text-accent hover:text-accent-light"
              >
                Retry
              </button>
            )}
          </div>
          
          {isTranscribing ? (
            <div className="flex items-center space-x-2 p-3 bg-surface rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
              <span className="text-sm text-muted">Transcribing audio...</span>
            </div>
          ) : transcription ? (
            <div className="p-3 bg-surface rounded-lg">
              <p className="text-sm">{transcription}</p>
            </div>
          ) : (
            <div className="p-3 bg-surface rounded-lg">
              <p className="text-sm text-muted italic">
                {error ? 'Transcription failed. You can still save the audio recording.' : 'No transcription available'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hidden audio element for playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  )
}

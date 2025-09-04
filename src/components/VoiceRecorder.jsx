import React, { useState, useRef } from 'react'
import { Mic, MicOff, Square, Play, Pause } from 'lucide-react'

export default function VoiceRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const mediaRecorderRef = useRef(null)
  const audioRef = useRef(null)
  const timerRef = useRef(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      clearInterval(timerRef.current)
    }
  }

  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const saveRecording = () => {
    if (audioBlob) {
      // Mock transcription - in real app, you'd use OpenAI Whisper API
      const mockTranscription = "This is a mock transcription of the voice recording. In a real implementation, this would be processed by OpenAI's Whisper API for accurate speech-to-text conversion."
      
      onRecordingComplete(audioBlob, mockTranscription)
      setAudioBlob(null)
      setRecordingTime(0)
    }
  }

  const discardRecording = () => {
    setAudioBlob(null)
    setRecordingTime(0)
    setIsPlaying(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {/* Recording Status */}
      {isRecording && (
        <div className="flex items-center justify-center space-x-2 p-3 bg-red-900 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-400 font-medium">Recording: {formatTime(recordingTime)}</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col items-center space-y-4">
        {!audioBlob ? (
          // Recording controls
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
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
              className="px-4 py-2 btn-primary"
            >
              Save Entry
            </button>
            
            <button
              onClick={discardRecording}
              className="px-4 py-2 btn-secondary"
            >
              Discard
            </button>
          </div>
        )}

        {/* Instructions */}
        <p className="text-sm text-muted text-center">
          {!audioBlob 
            ? (isRecording ? 'Click stop when finished' : 'Click to start recording')
            : 'Listen to your recording and save or discard'
          }
        </p>
      </div>

      {/* Hidden audio element for playback */}
      {audioBlob && (
        <audio
          ref={audioRef}
          src={URL.createObjectURL(audioBlob)}
          onEnded={() => setIsPlaying(false)}
          style={{ display: 'none' }}
        />
      )}
    </div>
  )
}
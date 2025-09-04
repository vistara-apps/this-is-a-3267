// Audio recording and processing service
export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null
    this.audioChunks = []
    this.stream = null
    this.isRecording = false
  }

  // Check if browser supports audio recording
  static isSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder)
  }

  // Request microphone permission and initialize recorder
  async initialize() {
    if (!AudioRecorder.isSupported()) {
      throw new Error('Audio recording is not supported in this browser')
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.getSupportedMimeType()
      })

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      return true
    } catch (error) {
      console.error('Error initializing audio recorder:', error)
      throw new Error('Failed to access microphone. Please check permissions.')
    }
  }

  // Get the best supported MIME type for recording
  getSupportedMimeType() {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/wav'
    ]

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }

    return 'audio/webm' // fallback
  }

  // Start recording
  async startRecording() {
    if (!this.mediaRecorder) {
      await this.initialize()
    }

    if (this.mediaRecorder.state === 'recording') {
      return
    }

    this.audioChunks = []
    this.mediaRecorder.start(100) // Collect data every 100ms
    this.isRecording = true
  }

  // Stop recording and return audio blob
  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') {
        reject(new Error('No active recording to stop'))
        return
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { 
          type: this.getSupportedMimeType() 
        })
        this.isRecording = false
        resolve(audioBlob)
      }

      this.mediaRecorder.onerror = (error) => {
        reject(error)
      }

      this.mediaRecorder.stop()
    })
  }

  // Pause recording
  pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause()
    }
  }

  // Resume recording
  resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume()
    }
  }

  // Clean up resources
  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
    this.mediaRecorder = null
    this.audioChunks = []
    this.isRecording = false
  }

  // Get current recording state
  getState() {
    return this.mediaRecorder ? this.mediaRecorder.state : 'inactive'
  }

  // Get recording duration (approximate)
  getRecordingDuration() {
    // This is an approximation based on chunks
    return this.audioChunks.length * 0.1 // 100ms per chunk
  }
}

// Audio utility functions
export const audioUtils = {
  // Convert audio blob to File object for API upload
  blobToFile(blob, filename = 'recording.webm') {
    return new File([blob], filename, { type: blob.type })
  },

  // Create audio URL for playback
  createAudioURL(blob) {
    return URL.createObjectURL(blob)
  },

  // Revoke audio URL to free memory
  revokeAudioURL(url) {
    URL.revokeObjectURL(url)
  },

  // Get audio duration from blob
  async getAudioDuration(blob) {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      const url = URL.createObjectURL(blob)
      
      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(url)
        resolve(audio.duration)
      })
      
      audio.addEventListener('error', (error) => {
        URL.revokeObjectURL(url)
        reject(error)
      })
      
      audio.src = url
    })
  },

  // Validate audio file size
  validateAudioSize(blob, maxSizeMB = 25) {
    const sizeMB = blob.size / (1024 * 1024)
    if (sizeMB > maxSizeMB) {
      throw new Error(`Audio file too large: ${sizeMB.toFixed(1)}MB. Maximum size is ${maxSizeMB}MB.`)
    }
    return true
  },

  // Format recording duration for display
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  },

  // Check if audio format is supported for transcription
  isSupportedForTranscription(mimeType) {
    const supportedTypes = [
      'audio/webm',
      'audio/mp4',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg'
    ]
    return supportedTypes.some(type => mimeType.includes(type))
  }
}

// Audio visualization utilities
export const audioVisualization = {
  // Create audio context for visualization
  createAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    return new AudioContext()
  },

  // Create analyser for real-time visualization
  createAnalyser(audioContext, stream) {
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)
    
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.8
    
    source.connect(analyser)
    
    return analyser
  },

  // Get frequency data for visualization
  getFrequencyData(analyser) {
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)
    return dataArray
  },

  // Calculate average volume level
  getVolumeLevel(analyser) {
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)
    
    let sum = 0
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i]
    }
    
    return sum / bufferLength / 255 // Normalize to 0-1
  }
}

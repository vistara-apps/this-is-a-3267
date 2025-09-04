import React, { useState, useEffect } from 'react'
import { BookOpen, Mic, MicOff, Play, Pause, Trash2 } from 'lucide-react'
import VoiceRecorder from '../components/VoiceRecorder'

export default function Journal() {
  const [entries, setEntries] = useState([])
  const [textEntry, setTextEntry] = useState('')

  useEffect(() => {
    // Load journal entries from localStorage
    const savedEntries = localStorage.getItem('fastiflow-journal')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  const saveEntries = (newEntries) => {
    setEntries(newEntries)
    localStorage.setItem('fastiflow-journal', JSON.stringify(newEntries))
  }

  const addTextEntry = () => {
    if (!textEntry.trim()) return

    const newEntry = {
      id: Date.now().toString(),
      type: 'text',
      content: textEntry,
      timestamp: new Date().toISOString(),
    }

    const updatedEntries = [newEntry, ...entries]
    saveEntries(updatedEntries)
    setTextEntry('')
  }

  const addVoiceEntry = (audioBlob, transcription) => {
    const newEntry = {
      id: Date.now().toString(),
      type: 'voice',
      content: transcription || 'Voice recording',
      audioUrl: URL.createObjectURL(audioBlob),
      timestamp: new Date().toISOString(),
    }

    const updatedEntries = [newEntry, ...entries]
    saveEntries(updatedEntries)
  }

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id)
    saveEntries(updatedEntries)
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Fasting Journal</h1>
        <p className="text-muted">
          Record your thoughts, feelings, and insights during your fasting journey
        </p>
      </div>

      {/* Entry Creation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text Entry */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-accent" />
            Write Entry
          </h3>
          <textarea
            value={textEntry}
            onChange={(e) => setTextEntry(e.target.value)}
            placeholder="How are you feeling? Any insights or challenges during your fast?"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary mb-4"
            rows={4}
          />
          <button
            onClick={addTextEntry}
            disabled={!textEntry.trim()}
            className="w-full btn-primary disabled:opacity-50"
          >
            Save Entry
          </button>
        </div>

        {/* Voice Entry */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Mic className="h-5 w-5 mr-2 text-accent" />
            Voice Entry
          </h3>
          <VoiceRecorder onRecordingComplete={addVoiceEntry} />
        </div>
      </div>

      {/* Journal Entries */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-6">Your Journal Entries</h3>
        
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted opacity-50 mx-auto mb-4" />
            <p className="text-muted">No journal entries yet. Start by writing or recording your first entry!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm text-muted">{formatDate(entry.timestamp)}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      {entry.type === 'voice' ? (
                        <Mic className="h-4 w-4 text-accent" />
                      ) : (
                        <BookOpen className="h-4 w-4 text-accent" />
                      )}
                      <span className="text-xs text-accent capitalize">{entry.type} Entry</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="text-sm leading-relaxed mb-3">
                  {entry.content}
                </div>

                {entry.type === 'voice' && entry.audioUrl && (
                  <audio controls className="w-full mt-2">
                    <source src={entry.audioUrl} type="audio/webm" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
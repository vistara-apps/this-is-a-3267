import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from '../config/firebase'

// User Profile Operations
export const userService = {
  async createUser(userId, userData) {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...userData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  async getUser(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      return userDoc.exists() ? userDoc.data() : null
    } catch (error) {
      console.error('Error getting user:', error)
      throw error
    }
  },

  async updateUser(userId, updates) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }
}

// Fasting Log Operations
export const fastingLogService = {
  async createFastingLog(userId, logData) {
    try {
      const docRef = await addDoc(collection(db, 'fastingLogs'), {
        ...logData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating fasting log:', error)
      throw error
    }
  },

  async getFastingLogs(userId, limitCount = 50) {
    try {
      const q = query(
        collection(db, 'fastingLogs'),
        where('userId', '==', userId),
        orderBy('startTime', 'desc'),
        limit(limitCount)
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate(),
        endTime: doc.data().endTime?.toDate()
      }))
    } catch (error) {
      console.error('Error getting fasting logs:', error)
      throw error
    }
  },

  async updateFastingLog(logId, updates) {
    try {
      await updateDoc(doc(db, 'fastingLogs', logId), {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating fasting log:', error)
      throw error
    }
  },

  async deleteFastingLog(logId) {
    try {
      await deleteDoc(doc(db, 'fastingLogs', logId))
    } catch (error) {
      console.error('Error deleting fasting log:', error)
      throw error
    }
  },

  // Real-time listener for fasting logs
  subscribeFastingLogs(userId, callback, limitCount = 50) {
    const q = query(
      collection(db, 'fastingLogs'),
      where('userId', '==', userId),
      orderBy('startTime', 'desc'),
      limit(limitCount)
    )
    
    return onSnapshot(q, (querySnapshot) => {
      const logs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate(),
        endTime: doc.data().endTime?.toDate()
      }))
      callback(logs)
    })
  }
}

// Journal Entry Operations
export const journalService = {
  async createJournalEntry(userId, entryData) {
    try {
      const docRef = await addDoc(collection(db, 'journalEntries'), {
        ...entryData,
        userId,
        timestamp: entryData.timestamp || serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating journal entry:', error)
      throw error
    }
  },

  async getJournalEntries(userId, limitCount = 50) {
    try {
      const q = query(
        collection(db, 'journalEntries'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }))
    } catch (error) {
      console.error('Error getting journal entries:', error)
      throw error
    }
  },

  async updateJournalEntry(entryId, updates) {
    try {
      await updateDoc(doc(db, 'journalEntries', entryId), {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating journal entry:', error)
      throw error
    }
  },

  async deleteJournalEntry(entryId) {
    try {
      await deleteDoc(doc(db, 'journalEntries', entryId))
    } catch (error) {
      console.error('Error deleting journal entry:', error)
      throw error
    }
  },

  // Real-time listener for journal entries
  subscribeJournalEntries(userId, callback, limitCount = 50) {
    const q = query(
      collection(db, 'journalEntries'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )
    
    return onSnapshot(q, (querySnapshot) => {
      const entries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }))
      callback(entries)
    })
  }
}

// AI Conversation Operations
export const aiConversationService = {
  async createConversation(userId, conversationData) {
    try {
      const docRef = await addDoc(collection(db, 'aiConversations'), {
        ...conversationData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating AI conversation:', error)
      throw error
    }
  },

  async getConversations(userId, limitCount = 20) {
    try {
      const q = query(
        collection(db, 'aiConversations'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }))
    } catch (error) {
      console.error('Error getting AI conversations:', error)
      throw error
    }
  },

  async updateConversation(conversationId, updates) {
    try {
      await updateDoc(doc(db, 'aiConversations', conversationId), {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating AI conversation:', error)
      throw error
    }
  }
}

// Analytics and Statistics
export const analyticsService = {
  async getFastingStats(userId, startDate, endDate) {
    try {
      const q = query(
        collection(db, 'fastingLogs'),
        where('userId', '==', userId),
        where('startTime', '>=', Timestamp.fromDate(startDate)),
        where('startTime', '<=', Timestamp.fromDate(endDate)),
        orderBy('startTime', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const logs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate(),
        endTime: doc.data().endTime?.toDate()
      }))

      // Calculate statistics
      const totalFasts = logs.length
      const completedFasts = logs.filter(log => log.endTime).length
      const totalHours = logs.reduce((sum, log) => sum + (log.duration || 0), 0) / 60
      const avgDuration = completedFasts > 0 ? totalHours / completedFasts : 0
      const avgMood = logs.filter(log => log.mood).reduce((sum, log, _, arr) => sum + log.mood / arr.length, 0)

      return {
        totalFasts,
        completedFasts,
        totalHours,
        avgDuration,
        avgMood,
        logs
      }
    } catch (error) {
      console.error('Error getting fasting stats:', error)
      throw error
    }
  }
}

// Utility functions
export const firestoreUtils = {
  // Convert Firestore timestamp to Date
  timestampToDate(timestamp) {
    return timestamp?.toDate() || null
  },

  // Convert Date to Firestore timestamp
  dateToTimestamp(date) {
    return Timestamp.fromDate(date)
  },

  // Get server timestamp
  getServerTimestamp() {
    return serverTimestamp()
  }
}

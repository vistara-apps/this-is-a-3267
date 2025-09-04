// Pinata IPFS service for decentralized audio storage
const PINATA_API_URL = 'https://api.pinata.cloud'
const PINATA_GATEWAY_URL = 'https://gateway.pinata.cloud/ipfs'

class PinataService {
  constructor() {
    this.apiKey = import.meta.env.VITE_PINATA_API_KEY
    this.secretApiKey = import.meta.env.VITE_PINATA_SECRET_API_KEY
  }

  // Check if Pinata is configured
  isConfigured() {
    return !!(this.apiKey && this.secretApiKey)
  }

  // Get authentication headers
  getAuthHeaders() {
    return {
      'pinata_api_key': this.apiKey,
      'pinata_secret_api_key': this.secretApiKey
    }
  }

  // Test authentication
  async testAuthentication() {
    try {
      const response = await fetch(`${PINATA_API_URL}/data/testAuthentication`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data.message === 'Congratulations! You are communicating with the Pinata API!'
    } catch (error) {
      console.error('Pinata authentication test failed:', error)
      return false
    }
  }

  // Pin file to IPFS
  async pinFile(file, metadata = {}) {
    if (!this.isConfigured()) {
      throw new Error('Pinata API keys not configured')
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Add metadata
      const pinataMetadata = {
        name: metadata.name || file.name || 'audio-recording',
        keyvalues: {
          type: 'audio',
          uploadedAt: new Date().toISOString(),
          ...metadata.keyvalues
        }
      }
      formData.append('pinataMetadata', JSON.stringify(pinataMetadata))

      // Add options
      const pinataOptions = {
        cidVersion: 1,
        ...metadata.options
      }
      formData.append('pinataOptions', JSON.stringify(pinataOptions))

      const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Failed to pin file: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      return {
        ipfsHash: data.IpfsHash,
        pinSize: data.PinSize,
        timestamp: data.Timestamp,
        gatewayUrl: `${PINATA_GATEWAY_URL}/${data.IpfsHash}`,
        metadata: pinataMetadata
      }
    } catch (error) {
      console.error('Error pinning file to IPFS:', error)
      throw error
    }
  }

  // Pin JSON data to IPFS
  async pinJSON(jsonData, metadata = {}) {
    if (!this.isConfigured()) {
      throw new Error('Pinata API keys not configured')
    }

    try {
      const pinataMetadata = {
        name: metadata.name || 'json-data',
        keyvalues: {
          type: 'json',
          uploadedAt: new Date().toISOString(),
          ...metadata.keyvalues
        }
      }

      const pinataOptions = {
        cidVersion: 1,
        ...metadata.options
      }

      const requestBody = {
        pinataContent: jsonData,
        pinataMetadata,
        pinataOptions
      }

      const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Failed to pin JSON: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      return {
        ipfsHash: data.IpfsHash,
        pinSize: data.PinSize,
        timestamp: data.Timestamp,
        gatewayUrl: `${PINATA_GATEWAY_URL}/${data.IpfsHash}`,
        metadata: pinataMetadata
      }
    } catch (error) {
      console.error('Error pinning JSON to IPFS:', error)
      throw error
    }
  }

  // Get pinned files list
  async getPinnedFiles(options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Pinata API keys not configured')
    }

    try {
      const params = new URLSearchParams({
        pageLimit: options.pageLimit || 10,
        pageOffset: options.pageOffset || 0,
        ...options.filters
      })

      const response = await fetch(`${PINATA_API_URL}/data/pinList?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to get pinned files: ${response.statusText}`)
      }

      const data = await response.json()
      return data.rows.map(row => ({
        ipfsHash: row.ipfs_pin_hash,
        size: row.size,
        timestamp: row.date_pinned,
        name: row.metadata?.name,
        keyvalues: row.metadata?.keyvalues,
        gatewayUrl: `${PINATA_GATEWAY_URL}/${row.ipfs_pin_hash}`
      }))
    } catch (error) {
      console.error('Error getting pinned files:', error)
      throw error
    }
  }

  // Unpin file from IPFS
  async unpinFile(ipfsHash) {
    if (!this.isConfigured()) {
      throw new Error('Pinata API keys not configured')
    }

    try {
      const response = await fetch(`${PINATA_API_URL}/pinning/unpin/${ipfsHash}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to unpin file: ${response.statusText}`)
      }

      return true
    } catch (error) {
      console.error('Error unpinning file:', error)
      throw error
    }
  }

  // Get file from IPFS
  async getFile(ipfsHash) {
    try {
      const response = await fetch(`${PINATA_GATEWAY_URL}/${ipfsHash}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`)
      }

      return response
    } catch (error) {
      console.error('Error getting file from IPFS:', error)
      throw error
    }
  }

  // Get JSON data from IPFS
  async getJSON(ipfsHash) {
    try {
      const response = await this.getFile(ipfsHash)
      return await response.json()
    } catch (error) {
      console.error('Error getting JSON from IPFS:', error)
      throw error
    }
  }

  // Generate gateway URL
  getGatewayUrl(ipfsHash) {
    return `${PINATA_GATEWAY_URL}/${ipfsHash}`
  }

  // Get account usage statistics
  async getUsageStats() {
    if (!this.isConfigured()) {
      throw new Error('Pinata API keys not configured')
    }

    try {
      const response = await fetch(`${PINATA_API_URL}/data/userPinnedDataTotal`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to get usage stats: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        pinCount: data.pin_count,
        pinSizeTotal: data.pin_size_total,
        pinSizeWithReplicationsTotal: data.pin_size_with_replications_total
      }
    } catch (error) {
      console.error('Error getting usage stats:', error)
      throw error
    }
  }
}

// Create singleton instance
export const pinataService = new PinataService()

// Utility functions for IPFS integration
export const ipfsUtils = {
  // Validate IPFS hash format
  isValidIPFSHash(hash) {
    // Basic validation for IPFS hash (CIDv0 and CIDv1)
    const cidv0Regex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/
    const cidv1Regex = /^b[a-z2-7]{58}$/
    return cidv0Regex.test(hash) || cidv1Regex.test(hash)
  },

  // Extract IPFS hash from URL
  extractHashFromUrl(url) {
    const match = url.match(/\/ipfs\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
  },

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // Generate metadata for audio files
  generateAudioMetadata(audioBlob, transcription = '', userContext = {}) {
    return {
      name: `audio-${Date.now()}`,
      keyvalues: {
        type: 'audio',
        mimeType: audioBlob.type,
        size: audioBlob.size.toString(),
        duration: userContext.duration?.toString() || '',
        transcription: transcription || '',
        userId: userContext.userId || '',
        timestamp: new Date().toISOString(),
        app: 'FastiFlow'
      }
    }
  },

  // Check if IPFS is available (basic connectivity test)
  async testIPFSConnectivity() {
    try {
      const response = await fetch(`${PINATA_GATEWAY_URL}/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme`, {
        method: 'HEAD',
        timeout: 5000
      })
      return response.ok
    } catch (error) {
      console.warn('IPFS connectivity test failed:', error)
      return false
    }
  }
}

export default pinataService

import { useState } from 'react'
import axios from 'axios'

interface RAGDocument {
  content: string
  metadata: Record<string, any>
}

interface SearchResult {
  content: string
  metadata: Record<string, any>
}

interface ConversationalResult {
  answer: string
  sources: SearchResult[]
  question: string
  success: boolean
}

interface RAGStats {
  documentCount: number
  hasStore: boolean
  success: boolean
}

export function useRAG() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addDocument = async (content: string, metadata: Record<string, any> = {}) => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post('/api/rag', {
        action: 'addDocument',
        data: { content, metadata },
      })

      return response.data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add document'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const addDocuments = async (documents: RAGDocument[]) => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post('/api/rag', {
        action: 'addDocuments',
        data: { documents },
      })

      return response.data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add documents'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const search = async (query: string, k: number = 5): Promise<SearchResult[] | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post('/api/rag', {
        action: 'search',
        data: { query, k },
      })

      return response.data.results
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Search failed'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const generateAnswer = async (
    question: string,
    context?: string,
    includeContext: boolean = true
  ): Promise<string | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post('/api/rag', {
        action: 'generateAnswer',
        data: { question, context, includeContext },
      })

      return response.data.answer
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Answer generation failed'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const conversationalRAG = async (
    question: string,
    chatHistory: Array<{ human: string; ai: string }> = []
  ): Promise<ConversationalResult | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post('/api/rag', {
        action: 'conversationalRAG',
        data: { question, chatHistory },
      })

      return response.data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Conversational RAG failed'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const summarizeDocuments = async (query?: string): Promise<string | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post('/api/rag', {
        action: 'summarize',
        data: { query },
      })

      return response.data.summary
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Summarization failed'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getStats = async (): Promise<RAGStats | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.get('/api/rag')
      return response.data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to get stats'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const clearVectorStore = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.delete('/api/rag')
      return response.data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to clear vector store'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    addDocument,
    addDocuments,
    search,
    generateAnswer,
    conversationalRAG,
    summarizeDocuments,
    getStats,
    clearVectorStore,
  }
}

export function useRAGChat() {
  const [chatHistory, setChatHistory] = useState<Array<{ human: string; ai: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (message: string): Promise<ConversationalResult | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post('/api/rag', {
        action: 'conversationalRAG',
        data: { question: message, chatHistory },
      })

      if (response.data.success) {
        setChatHistory(prev => [
          ...prev,
          { human: message, ai: response.data.answer }
        ])
      }

      return response.data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Message sending failed'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    setChatHistory([])
  }

  return {
    chatHistory,
    loading,
    error,
    sendMessage,
    clearHistory,
  }
}
import { useState } from 'react'
import { AgentType } from '@/lib/ai-agents'
import axios from 'axios'

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
  agentType?: AgentType | 'general'
}

interface UseAIAgentReturn {
  messages: Message[]
  loading: boolean
  error: string | null
  sendMessage: (message: string, agentType?: AgentType) => Promise<void>
  clearChat: () => Promise<void>
  getMemory: () => Promise<string>
}

export function useAIAgent(sessionId?: string): UseAIAgentReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSessionId] = useState(sessionId || `session-${Date.now()}`)

  const sendMessage = async (message: string, agentType?: AgentType) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: message,
      sender: 'user',
      timestamp: new Date(),
      agentType: agentType || 'general',
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('/api/agents', {
        message,
        sessionId: currentSessionId,
        agentType,
      })

      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        text: response.data.response,
        sender: 'agent',
        timestamp: new Date(),
        agentType: response.data.agentType,
      }

      setMessages(prev => [...prev, agentMessage])
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMsg)
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'agent',
        timestamp: new Date(),
        agentType: agentType || 'general',
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = async () => {
    try {
      setLoading(true)
      await axios.delete('/api/agents', {
        data: { sessionId: currentSessionId }
      })
      setMessages([])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear chat')
    } finally {
      setLoading(false)
    }
  }

  const getMemory = async (): Promise<string> => {
    try {
      const response = await axios.get(`/api/agents?sessionId=${currentSessionId}`)
      return response.data.memory
    } catch (err) {
      console.error('Failed to get memory:', err)
      return ''
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat,
    getMemory,
  }
}
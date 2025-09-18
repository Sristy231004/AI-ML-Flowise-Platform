import { useState, useEffect } from 'react'
import { flowiseClient, Chatflow, FlowiseResponse } from '@/lib/flowise'

export function useFlowise() {
  const [chatflows, setChatflows] = useState<Chatflow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchChatflows = async () => {
    try {
      setLoading(true)
      setError(null)
      const flows = await flowiseClient.getChatflows()
      setChatflows(flows)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChatflows()
  }, [])

  const sendMessage = async (
    chatflowId: string,
    message: string,
    sessionId?: string
  ): Promise<FlowiseResponse | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await flowiseClient.predict(chatflowId, message, sessionId)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    chatflows,
    loading,
    error,
    sendMessage,
    refetchChatflows: fetchChatflows,
  }
}

export function useFlowiseChat(chatflowId: string) {
  const [messages, setMessages] = useState<Array<{
    id: string
    text: string
    sender: 'user' | 'bot'
    timestamp: Date
  }>>([])
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(`session-${Date.now()}`)

  const sendMessage = async (text: string) => {
    const userMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user' as const,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      const response = await flowiseClient.predict(chatflowId, text, sessionId)
      
      const botMessage = {
        id: `bot-${Date.now()}`,
        text: response.response,
        sender: 'bot' as const,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot' as const,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const clearMessages = () => {
    setMessages([])
  }

  return {
    messages,
    loading,
    sendMessage,
    clearMessages,
    sessionId,
  }
}
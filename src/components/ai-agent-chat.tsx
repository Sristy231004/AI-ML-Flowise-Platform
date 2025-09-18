'use client'

import { useState, useRef, useEffect } from 'react'
import { useAIAgent } from '@/hooks/useAIAgent'
import { AgentType } from '@/lib/ai-agents'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function AIAgentChat() {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('data-analyst')
  const [message, setMessage] = useState('')
  const { messages, loading, error, sendMessage, clearChat } = useAIAgent()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const agentTypes = [
    { 
      id: 'data-analyst', 
      label: 'Data Analyst', 
      icon: '📊',
      description: 'Statistical analysis and insights',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    { 
      id: 'code-assistant', 
      label: 'Code Assistant', 
      icon: '💻',
      description: 'Programming help and debugging',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    { 
      id: 'document-processor', 
      label: 'Document Processor', 
      icon: '📄',
      description: 'Text analysis and summarization',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    { 
      id: 'ml-engineer', 
      label: 'ML Engineer', 
      icon: '🔬',
      description: 'Machine learning expertise',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
  ] as const

  const getCurrentAgent = () => agentTypes.find(a => a.id === selectedAgent)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [selectedAgent])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!message.trim() || loading) return
    
    const messageToSend = message
    setMessage('')
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    
    await sendMessage(messageToSend, selectedAgent)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  const exampleQuestions = {
    'data-analyst': [
      "Analyze the correlation between marketing spend and revenue",
      "What insights can you provide about customer segmentation?",
      "Help me understand statistical significance in A/B testing"
    ],
    'code-assistant': [
      "How can I optimize this React component for better performance?",
      "Debug this Python function that's throwing an error",
      "Explain the difference between async/await and promises"
    ],
    'document-processor': [
      "Summarize the key points from this research paper",
      "Extract action items from this meeting transcript",
      "Analyze the sentiment of customer feedback"
    ],
    'ml-engineer': [
      "What's the best model architecture for image classification?",
      "How do I handle overfitting in my neural network?",
      "Explain hyperparameter tuning strategies"
    ]
  }

  const handleExampleClick = (question: string) => {
    setMessage(question)
    if (textareaRef.current) {
      textareaRef.current.focus()
      // Auto-resize for the example question
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }

  const currentAgent = getCurrentAgent()

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Agent Selection Header */}
      <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <span className="text-xl text-gray-900">AI Agent Chat</span>
              <CardDescription className="mt-1">
                Intelligent conversations with specialized AI assistants
              </CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {agentTypes.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`p-4 rounded-xl text-left transition-all duration-300 group ${
                  selectedAgent === agent.id
                    ? `bg-gradient-to-r ${agent.color} text-white shadow-lg transform scale-105`
                    : `${agent.bgColor} hover:shadow-md border border-gray-100 hover:scale-102`
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{agent.icon}</span>
                  <span className={`font-semibold text-sm ${
                    selectedAgent === agent.id ? 'text-white' : agent.textColor
                  }`}>
                    {agent.label}
                  </span>
                </div>
                <div className={`text-xs ${
                  selectedAgent === agent.id ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {agent.description}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
        {/* Chat Header */}
        <div className={`p-4 border-b border-gray-200/50 bg-gradient-to-r ${currentAgent?.color}`}>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{currentAgent?.icon}</span>
              <div>
                <h3 className="font-semibold text-lg">{currentAgent?.label}</h3>
                <p className="text-white/90 text-sm">{currentAgent?.description}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={clearChat}
              disabled={loading}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
            >
              Clear Chat
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50" style={{ maxHeight: 'calc(100vh - 400px)' }}>
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentAgent?.color} flex items-center justify-center mx-auto mb-4`}>
                <span className="text-white text-3xl">{currentAgent?.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chat with {currentAgent?.label}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Ask questions, get expert advice, or start with one of the examples below.
              </p>
              
              {/* Example Questions */}
              <div className="max-w-2xl mx-auto">
                <h4 className="text-sm font-medium text-gray-700 mb-3">💡 Try these examples:</h4>
                <div className="grid gap-2">
                  {exampleQuestions[selectedAgent]?.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(question)}
                      className="text-left p-3 bg-white/70 hover:bg-white border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md group"
                    >
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        "{question}"
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${
                    msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                      : `bg-gradient-to-r ${currentAgent?.color}`
                  }`}>
                    <span className="text-white text-sm font-semibold">
                      {msg.sender === 'user' ? 'You' : currentAgent?.icon}
                    </span>
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`max-w-[80%] ${
                    msg.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`p-4 rounded-2xl shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-white border border-gray-200'
                    }`}>
                      <div className={`text-sm whitespace-pre-wrap ${
                        msg.sender === 'user' ? 'text-white' : 'text-gray-800'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                    <div className={`text-xs mt-1 px-2 ${
                      msg.sender === 'user' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {loading && (
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentAgent?.color} flex items-center justify-center`}>
                    <span className="text-white text-sm">{currentAgent?.icon}</span>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mb-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">⚠️</span>
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200/50 bg-white/80">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${currentAgent?.label}...`}
                className="w-full p-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                rows={1}
                disabled={loading}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                {message.length > 0 && `${message.length}`}
              </div>
            </div>
            <Button
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className={`px-6 py-3 bg-gradient-to-r ${currentAgent?.color} hover:shadow-lg transition-all duration-200 disabled:opacity-50`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Send</span>
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>{messages.length} messages</span>
          </div>
        </div>
      </div>
    </div>
  )
}
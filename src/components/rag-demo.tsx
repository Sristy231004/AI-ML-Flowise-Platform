'use client'

import { useState, useEffect, useRef } from 'react'
import { useRAG, useRAGChat } from '@/hooks/useRAG'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function RAGDemo() {
  const { 
    loading, 
    error, 
    addDocument, 
    search, 
    generateAnswer, 
    getStats, 
    clearVectorStore 
  } = useRAG()
  
  const {
    chatHistory,
    loading: chatLoading,
    error: chatError,
    sendMessage,
    clearHistory,
  } = useRAGChat()

  const [activeTab, setActiveTab] = useState<'add-docs' | 'search' | 'qa' | 'chat'>('chat')
  const [stats, setStats] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Add Documents
  const [documentText, setDocumentText] = useState(`# AI/ML Platform Documentation

## Overview
This platform integrates multiple AI technologies including LangChain, TensorFlow, and Flowise.

## Features
- Open access platform (no login required)
- AI agents with specialized capabilities
- Machine learning model integration
- Retrieval-Augmented Generation (RAG)
- Data preprocessing and analysis

## Technologies
- Frontend: Next.js, TypeScript, Tailwind CSS
- AI/ML: LangChain, TensorFlow.js, OpenAI API
- Database: Prisma with SQLite`)
  
  // Search
  const [searchQuery, setSearchQuery] = useState('What features does the platform have?')
  const [searchResults, setSearchResults] = useState<any>(null)
  
  // Q&A
  const [question, setQuestion] = useState('How does the platform work?')
  const [answer, setAnswer] = useState<string>('')
  
  // Chat
  const [chatMessage, setChatMessage] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadStats = async () => {
    const statsData = await getStats()
    setStats(statsData)
  }

  const handleAddDocument = async () => {
    if (!documentText.trim()) return
    
    const result = await addDocument(documentText, {
      source: 'user-input',
      timestamp: new Date().toISOString(),
      type: 'documentation',
    })
    
    if (result) {
      await loadStats()
      setDocumentText('')
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    const results = await search(searchQuery, 5)
    setSearchResults(results)
  }

  const handleGenerateAnswer = async () => {
    if (!question.trim()) return
    
    const result = await generateAnswer(question)
    setAnswer(result || '')
  }

  const handleChatSend = async () => {
    if (!chatMessage.trim() || chatLoading) return
    
    const messageToSend = chatMessage
    setChatMessage('')
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    
    await sendMessage(messageToSend)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (activeTab === 'chat') {
        handleChatSend()
      } else if (activeTab === 'qa') {
        handleGenerateAnswer()
      } else if (activeTab === 'search') {
        handleSearch()
      }
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatMessage(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  const handleClear = async () => {
    await clearVectorStore()
    await loadStats()
    setSearchResults(null)
    setAnswer('')
    clearHistory()
  }

  const sampleQuestions = [
    "What are the main features of this AI/ML platform?",
    "How does the platform work without authentication?",
    "Explain the RAG system implementation",
    "What technologies are used in the frontend?",
    "How do I integrate with Flowise?",
    "What are the capabilities of the AI agents?"
  ]

  const handleSampleQuestionClick = (question: string) => {
    if (activeTab === 'chat') {
      setChatMessage(question)
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
      }
    } else if (activeTab === 'qa') {
      setQuestion(question)
    } else if (activeTab === 'search') {
      setSearchQuery(question)
    }
  }

  const tabs = [
    { id: 'chat', label: 'Smart Chat', icon: '💬', description: 'Conversational AI with knowledge base', color: 'from-blue-500 to-cyan-500' },
    { id: 'qa', label: 'Q&A', icon: '❓', description: 'Generate precise answers', color: 'from-green-500 to-emerald-500' },
    { id: 'search', label: 'Search', icon: '🔍', description: 'Find relevant documents', color: 'from-purple-500 to-violet-500' },
    { id: 'add-docs', label: 'Add Docs', icon: '📄', description: 'Expand knowledge base', color: 'from-orange-500 to-red-500' },
  ] as const

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      {/* Header */}
      <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">📚</span>
              </div>
              <div>
                <span className="text-xl text-gray-900">RAG System</span>
                <CardDescription className="mt-1">
                  Retrieval-Augmented Generation with intelligent document search
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${stats?.hasStore ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-gray-600">
                    {stats?.hasStore ? `${stats.documentCount} documents` : 'No documents'}
                  </span>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleClear} 
                disabled={loading}
                className="bg-white/80 hover:bg-gray-50"
              >
                Clear All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-xl text-left transition-all duration-300 group ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                    : 'bg-gray-50 hover:bg-white hover:shadow-md border border-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{tab.icon}</span>
                  <span className={`font-semibold text-sm ${
                    activeTab === tab.id ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {tab.label}
                  </span>
                </div>
                <div className={`text-xs ${
                  activeTab === tab.id ? 'text-white/90' : 'text-gray-500 group-hover:text-gray-600'
                }`}>
                  {tab.description}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
        {/* Smart Chat Tab */}
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-500 to-cyan-500">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <h3 className="font-semibold text-lg">Smart Chat</h3>
                    <p className="text-white/90 text-sm">AI assistant with access to your knowledge base</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => clearHistory()}
                  disabled={chatLoading}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
                >
                  Clear Chat
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50" style={{ maxHeight: 'calc(100vh - 500px)' }}>
              {chatHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-3xl">💬</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Start a Conversation
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Ask questions about your documents or general topics. I'll provide intelligent answers using both your knowledge base and my training.
                  </p>
                  
                  {/* Sample Questions */}
                  <div className="max-w-2xl mx-auto">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">💡 Try these questions:</h4>
                    <div className="grid gap-2">
                      {sampleQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSampleQuestionClick(question)}
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
                  {chatHistory.map((exchange, index) => (
                    <div key={index} className="space-y-4">
                      {/* User Message */}
                      <div className="flex items-start space-x-3 flex-row-reverse space-x-reverse">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-semibold">You</span>
                        </div>
                        <div className="max-w-[80%] text-right">
                          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm">
                            <div className="text-sm whitespace-pre-wrap">{exchange.human}</div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 px-2">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      
                      {/* AI Response */}
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">🤖</span>
                        </div>
                        <div className="max-w-[80%]">
                          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                            <div className="text-sm text-gray-800 whitespace-pre-wrap">{exchange.ai}</div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 px-2">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {chatLoading && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        <span className="text-white text-xs">🤖</span>
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
            {chatError && (
              <div className="mx-4 mb-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">⚠️</span>
                  <span className="font-medium">Error:</span>
                  <span>{chatError}</span>
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200/50 bg-white/80">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={chatMessage}
                    onChange={handleTextareaChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your documents or any other topic..."
                    className="w-full p-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows={1}
                    disabled={chatLoading}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                    {chatMessage.length > 0 && `${chatMessage.length}`}
                  </div>
                </div>
                <Button
                  onClick={handleChatSend}
                  disabled={chatLoading || !chatMessage.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {chatLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Send</span>
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span>{chatHistory.length} exchanges</span>
              </div>
            </div>
          </div>
        )}

        {/* Q&A Tab */}
        {activeTab === 'qa' && (
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">❓</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Intelligent Q&A</h3>
                <p className="text-gray-600">Get precise answers based on your documents and general knowledge</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Question:
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ask a question about your documents..."
                    />
                    <Button 
                      onClick={handleGenerateAnswer}
                      disabled={loading || !question.trim()}
                      className="px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg"
                    >
                      {loading ? 'Generating...' : 'Ask'}
                    </Button>
                  </div>
                </div>
                
                {/* Sample Questions */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">💡 Sample questions:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sampleQuestions.slice(0, 4).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSampleQuestionClick(question)}
                        className="text-left p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-200 text-sm"
                      >
                        "{question}"
                      </button>
                    ))}
                  </div>
                </div>
                
                {answer && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Answer:</h4>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded-xl">
                      <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{answer}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🔍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Document Search</h3>
                <p className="text-gray-600">Find relevant information in your knowledge base</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Search your documents..."
                  />
                  <Button 
                    onClick={handleSearch}
                    disabled={loading || !searchQuery.trim()}
                    className="px-6 bg-gradient-to-r from-purple-500 to-violet-500 hover:shadow-lg"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
                
                {searchResults && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Search Results ({searchResults.length}):</h4>
                    <div className="space-y-4">
                      {searchResults.map((result: any, index: number) => (
                        <div key={index} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-gray-800 mb-2">{result.content}</div>
                          {result.metadata && (
                            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block">
                              Source: {result.metadata.source || 'Unknown'}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Documents Tab */}
        {activeTab === 'add-docs' && (
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">📄</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Add Documents</h3>
                <p className="text-gray-600">Expand your knowledge base with new documents</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Content:
                  </label>
                  <textarea
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={12}
                    placeholder="Paste your document content here..."
                  />
                </div>
                <Button 
                  onClick={handleAddDocument}
                  disabled={loading || !documentText.trim()}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg"
                >
                  {loading ? 'Adding Document...' : 'Add to Knowledge Base'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* General Error Display */}
        {error && (
          <div className="mx-6 mb-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">⚠️</span>
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Help Section */}
      <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <span className="text-xl">💡</span>
            <span>How RAG Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-blue-600">📄</span>
              </div>
              <h4 className="font-semibold mb-2 text-blue-900">1. Add Documents</h4>
              <p className="text-gray-600">Upload and process documents into searchable vector embeddings</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-purple-600">🔍</span>
              </div>
              <h4 className="font-semibold mb-2 text-purple-900">2. Search</h4>
              <p className="text-gray-600">Find relevant content using semantic similarity search</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-green-600">❓</span>
              </div>
              <h4 className="font-semibold mb-2 text-green-900">3. Generate</h4>
              <p className="text-gray-600">AI generates accurate answers using retrieved context</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-orange-600">💬</span>
              </div>
              <h4 className="font-semibold mb-2 text-orange-900">4. Chat</h4>
              <p className="text-gray-600">Maintain context across conversations for deeper insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
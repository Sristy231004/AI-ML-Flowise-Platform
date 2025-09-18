'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AIAgentChat } from '@/components/ai-agent-chat'
import { FlowiseChat } from '@/components/flowise-chat'
import { MLModelDemo } from '@/components/ml-model-demo'
import { RAGDemo } from '@/components/rag-demo'
import { DataPreprocessor } from '@/components/data-preprocessor'

type ActiveTab = 'overview' | 'ai-agents' | 'flowise' | 'ml-models' | 'rag' | 'data-prep'

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview')

  const tabs = [
    { id: 'overview', label: '📊 Overview', description: 'Platform overview and stats' },
    { id: 'ai-agents', label: '🤖 AI Agents', description: 'LangChain-powered AI assistants' },
    { id: 'flowise', label: '🌊 Flowise', description: 'Visual AI workflow builder' },
    { id: 'ml-models', label: '🧠 ML Models', description: 'TensorFlow/PyTorch integration' },
    { id: 'rag', label: '📚 RAG System', description: 'Retrieval-Augmented Generation' },
    { id: 'data-prep', label: '🔧 Data Prep', description: 'Data preprocessing tools' },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent />
      case 'ai-agents':
        return <AIAgentChat />
      case 'flowise':
        return <FlowiseChat />
      case 'ml-models':
        return <MLModelDemo />
      case 'rag':
        return <RAGDemo />
      case 'data-prep':
        return <DataPreprocessor />
      default:
        return <OverviewContent />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg font-bold">AI</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    AI/ML Flowise Platform
                  </h1>
                  <p className="text-xs text-gray-500">Intelligent Workflow Management</p>
                </div>
              </div>
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                Professional Edition
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div className="text-sm">
                  <div className="text-gray-900 font-medium">
                    AI Platform
                  </div>
                  <div className="text-gray-500 text-xs">
                    Open Access Mode
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`p-4 rounded-xl text-left transition-all duration-300 group ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl transform scale-105'
                      : 'bg-white/70 hover:bg-white hover:shadow-md border border-gray-100 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <div className={`font-semibold text-sm transition-all ${
                    activeTab === tab.id ? 'text-white' : 'group-hover:text-blue-600'
                  }`}>
                    {tab.label}
                  </div>
                  <div className={`text-xs mt-1 transition-all ${
                    activeTab === tab.id ? 'text-white/90' : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    {tab.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[600px] bg-white/40 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

function OverviewContent() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6">
          <span className="text-white text-2xl">🚀</span>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
          Welcome to the AI/ML Platform
        </h2>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
          A comprehensive platform showcasing AI/ML integration, Flowise workflows, 
          and intelligent features designed for modern AI applications. 
          Open access - no authentication required!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-3 text-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🌐</span>
              </div>
              <span className="text-gray-900">Open Access Platform</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Public access AI/ML platform with no authentication required
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No Sign-up Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Instant Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Full Feature Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Demo Mode Ready</span>
              </div>
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="text-sm">
                  <div className="font-semibold text-green-800">Access Status</div>
                  <div className="text-green-700 mt-1">
                    <strong>Mode:</strong> Open Public Access
                  </div>
                  <div className="text-green-700">
                    <strong>Status:</strong> Ready to Use
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-3 text-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🤖</span>
              </div>
              <span className="text-gray-900">AI Agents</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              LangChain-powered conversational AI with specialized agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Data Analyst Agent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Code Assistant Agent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Document Processor</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>ML Engineer Agent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Memory Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Context Awareness</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-3 text-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🌊</span>
              </div>
              <span className="text-gray-900">Flowise Integration</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Visual AI workflow builder and chatflow management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span>API Integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span>Chatflow Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span>Session Handling</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span>Custom Configurations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span>Real-time Predictions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-3 text-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🧠</span>
              </div>
              <span className="text-gray-900">ML Models</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              TensorFlow.js integration for client-side ML
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Neural Networks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Text Classification</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Data Preprocessing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Model Training</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Real-time Predictions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-3 text-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">📚</span>
              </div>
              <span className="text-gray-900">RAG System</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Retrieval-Augmented Generation with vector search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Document Embedding</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Vector Search</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Context Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Conversational RAG</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Document Summarization</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-3 text-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🔧</span>
              </div>
              <span className="text-gray-900">Data Processing</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Advanced data preprocessing and analysis tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Data Normalization</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Statistical Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Outlier Detection</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Pattern Recognition</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Data Insights</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🚀</span>
            </div>
            <span className="text-gray-900">Technical Implementation Highlights</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            Key technologies and frameworks powering this intelligent platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <h4 className="font-semibold mb-3 text-blue-900 flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xs">⚛️</span>
                </div>
                <span>Frontend</span>
              </h4>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Next.js 15 with App Router</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>TypeScript</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Tailwind CSS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Radix UI Components</span>
                </div>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <h4 className="font-semibold mb-3 text-purple-900 flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xs">🧠</span>
                </div>
                <span>AI/ML</span>
              </h4>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>LangChain</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>TensorFlow.js</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>OpenAI API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Vector Embeddings</span>
                </div>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <h4 className="font-semibold mb-3 text-green-900 flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xs">🌐</span>
                </div>
                <span>Open Platform</span>
              </h4>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Public Access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>No Login Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Demo Mode Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Instant Feature Access</span>
                </div>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <h4 className="font-semibold mb-3 text-amber-900 flex items-center space-x-2">
                <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-amber-600 text-xs">🔗</span>
                </div>
                <span>Integration</span>
              </h4>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span>Flowise API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span>Prisma ORM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span>RESTful APIs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  <span>Real-time Processing</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
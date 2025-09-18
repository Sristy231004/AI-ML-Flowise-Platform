import { NextRequest, NextResponse } from 'next/server'
import { ragService } from '@/lib/rag'

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'addDocument':
        return await handleAddDocument(data)
      
      case 'addDocuments':
        return await handleAddDocuments(data)
      
      case 'search':
        return await handleSearch(data)
      
      case 'generateAnswer':
        return await handleGenerateAnswer(data)
      
      case 'conversationalRAG':
        return await handleConversationalRAG(data)
      
      case 'summarize':
        return await handleSummarize(data)
      
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('RAG API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process RAG request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = ragService.getVectorStoreStats()
    return NextResponse.json({
      ...stats,
      success: true,
    })
  } catch (error) {
    console.error('RAG Stats Error:', error)
    return NextResponse.json(
      { error: 'Failed to get RAG stats' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    ragService.clearVectorStore()
    return NextResponse.json({
      message: 'Vector store cleared successfully',
      success: true,
    })
  } catch (error) {
    console.error('RAG Clear Error:', error)
    return NextResponse.json(
      { error: 'Failed to clear vector store' },
      { status: 500 }
    )
  }
}

async function handleAddDocument(data: { content: string; metadata?: Record<string, any> }) {
  const { content, metadata = {} } = data

  if (!content) {
    return NextResponse.json(
      { error: 'Content is required' },
      { status: 400 }
    )
  }

  await ragService.addDocument(content, metadata)

  return NextResponse.json({
    message: 'Document added successfully',
    success: true,
  })
}

async function handleAddDocuments(data: { documents: Array<{ content: string; metadata?: Record<string, any> }> }) {
  const { documents } = data

  if (!documents || !Array.isArray(documents)) {
    return NextResponse.json(
      { error: 'Documents array is required' },
      { status: 400 }
    )
  }

  const ragDocuments = documents.map((doc, index) => ({
    id: `doc-${Date.now()}-${index}`,
    content: doc.content,
    metadata: doc.metadata || {},
  }))

  await ragService.addDocuments(ragDocuments)

  return NextResponse.json({
    message: `${documents.length} documents added successfully`,
    success: true,
  })
}

async function handleSearch(data: { query: string; k?: number }) {
  const { query, k = 5 } = data

  if (!query) {
    return NextResponse.json(
      { error: 'Query is required' },
      { status: 400 }
    )
  }

  const results = await ragService.search(query, k)

  return NextResponse.json({
    results: results.map(doc => ({
      content: doc.pageContent,
      metadata: doc.metadata,
    })),
    count: results.length,
    success: true,
  })
}

async function handleGenerateAnswer(data: { 
  question: string; 
  context?: string; 
  includeContext?: boolean 
}) {
  const { question, context, includeContext = true } = data

  if (!question) {
    return NextResponse.json(
      { error: 'Question is required' },
      { status: 400 }
    )
  }

  const answer = await ragService.generateAnswer(question, context, includeContext)

  return NextResponse.json({
    answer,
    question,
    success: true,
  })
}

async function handleConversationalRAG(data: {
  question: string;
  chatHistory?: Array<{ human: string; ai: string }>;
}) {
  const { question, chatHistory = [] } = data

  if (!question) {
    return NextResponse.json(
      { error: 'Question is required' },
      { status: 400 }
    )
  }

  const result = await ragService.conversationalRAG(question, chatHistory)

  return NextResponse.json({
    answer: result.answer,
    sources: result.sources.map(doc => ({
      content: doc.pageContent,
      metadata: doc.metadata,
    })),
    question,
    success: true,
  })
}

async function handleSummarize(data: { query?: string }) {
  const { query } = data

  const summary = await ragService.summarizeDocuments(query)

  return NextResponse.json({
    summary,
    query,
    success: true,
  })
}
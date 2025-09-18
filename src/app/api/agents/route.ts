import { NextRequest, NextResponse } from 'next/server'
import { AIAgent, SpecializedAIAgent, AgentType } from '@/lib/ai-agents'

const agents = new Map<string, AIAgent>()

function getAgent(sessionId: string, agentType?: AgentType): AIAgent {
  const key = `${sessionId}-${agentType || 'general'}`
  
  if (!agents.has(key)) {
    const agent = agentType 
      ? new SpecializedAIAgent(agentType)
      : new AIAgent()
    agents.set(key, agent)
  }
  
  return agents.get(key)!
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, agentType, clearMemory } = await request.json()

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      )
    }

    const agent = getAgent(sessionId, agentType)

    if (clearMemory) {
      await agent.clearMemory()
    }

    const response = await agent.chat(message)

    return NextResponse.json({
      response,
      sessionId,
      agentType: agentType || 'general',
    })
  } catch (error) {
    console.error('AI Agent Error:', error)
    
    // Handle specific OpenAI API key error
    if (error instanceof Error && error.message.includes('OpenAI API key')) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key is not configured. Please check your environment variables.',
          details: 'The AI agent requires a valid OpenAI API key to function.'
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process AI request',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('sessionId')
    const agentType = url.searchParams.get('agentType') as AgentType
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'SessionId is required' },
        { status: 400 }
      )
    }

    const agent = getAgent(sessionId, agentType)
    const memory = await agent.getMemory()

    return NextResponse.json({
      memory,
      sessionId,
      agentType: agentType || 'general',
    })
  } catch (error) {
    console.error('Get Agent Memory Error:', error)
    return NextResponse.json(
      { error: 'Failed to get agent memory' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { sessionId, agentType } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'SessionId is required' },
        { status: 400 }
      )
    }

    const key = `${sessionId}-${agentType || 'general'}`
    
    if (agents.has(key)) {
      const agent = agents.get(key)!
      await agent.clearMemory()
      agents.delete(key)
    }

    return NextResponse.json({
      message: 'Agent session cleared',
      sessionId,
      agentType: agentType || 'general',
    })
  } catch (error) {
    console.error('Clear Agent Error:', error)
    return NextResponse.json(
      { error: 'Failed to clear agent session' },
      { status: 500 }
    )
  }
}
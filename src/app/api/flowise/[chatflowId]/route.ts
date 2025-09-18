import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const FLOWISE_API_URL = process.env.FLOWISE_API_URL || 'http://localhost:3001'
const FLOWISE_API_KEY = process.env.FLOWISE_API_KEY

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatflowId: string }> }
) {
  try {
    const { chatflowId } = await params

    const response = await axios.get(
      `${FLOWISE_API_URL}/api/v1/chatflows/${chatflowId}`,
      {
        headers: {
          ...(FLOWISE_API_KEY && { Authorization: `Bearer ${FLOWISE_API_KEY}` }),
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Failed to fetch chatflow:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chatflow' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatflowId: string }> }
) {
  try {
    const { chatflowId } = await params
    const { message, sessionId, overrideConfig } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const response = await axios.post(
      `${FLOWISE_API_URL}/api/v1/prediction/${chatflowId}`,
      {
        question: message,
        sessionId: sessionId || `session-${Date.now()}`,
        overrideConfig: overrideConfig || {},
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(FLOWISE_API_KEY && { Authorization: `Bearer ${FLOWISE_API_KEY}` }),
        },
      }
    )

    return NextResponse.json({
      response: response.data.text || response.data,
      sessionId: sessionId || `session-${Date.now()}`,
      chatflowId,
    })
  } catch (error) {
    console.error('Flowise prediction error:', error)
    return NextResponse.json(
      {
        error: 'Failed to get prediction from Flowise',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
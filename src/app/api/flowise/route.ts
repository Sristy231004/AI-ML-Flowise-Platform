import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const FLOWISE_API_URL = process.env.FLOWISE_API_URL || 'http://localhost:3001'
const FLOWISE_API_KEY = process.env.FLOWISE_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { message, chatflowId, sessionId } = await request.json()

    if (!message || !chatflowId) {
      return NextResponse.json(
        { error: 'Message and chatflowId are required' },
        { status: 400 }
      )
    }

    const response = await axios.post(
      `${FLOWISE_API_URL}/api/v1/prediction/${chatflowId}`,
      {
        question: message,
        sessionId: sessionId || 'default-session',
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
      sessionId: sessionId || 'default-session',
    })
  } catch (error) {
    console.error('Flowise API Error:', error)
    return NextResponse.json(
      { error: 'Failed to get response from Flowise' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get available chatflows
    const response = await axios.get(`${FLOWISE_API_URL}/api/v1/chatflows`, {
      headers: {
        ...(FLOWISE_API_KEY && { Authorization: `Bearer ${FLOWISE_API_KEY}` }),
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Failed to fetch chatflows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chatflows' },
      { status: 500 }
    )
  }
}
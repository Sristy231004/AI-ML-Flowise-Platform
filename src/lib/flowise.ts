import axios from 'axios'

export interface FlowiseMessage {
  question: string
  sessionId?: string
  overrideConfig?: Record<string, any>
}

export interface FlowiseResponse {
  response: string
  sessionId: string
  chatflowId?: string
}

export interface Chatflow {
  id: string
  name: string
  flowData: string
  deployed: boolean
  isPublic: boolean
  apikeyid: string
  createdDate: string
  updatedDate: string
}

class FlowiseClient {
  private baseURL: string

  constructor(baseURL: string = '/api/flowise') {
    this.baseURL = baseURL
  }

  async getChatflows(): Promise<Chatflow[]> {
    try {
      const response = await axios.get(this.baseURL)
      return response.data
    } catch (error) {
      console.error('Error fetching chatflows:', error)
      throw new Error('Failed to fetch chatflows')
    }
  }

  async getChatflow(chatflowId: string): Promise<Chatflow> {
    try {
      const response = await axios.get(`${this.baseURL}/${chatflowId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching chatflow:', error)
      throw new Error('Failed to fetch chatflow')
    }
  }

  async sendMessage(
    chatflowId: string,
    message: FlowiseMessage
  ): Promise<FlowiseResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/${chatflowId}`, message)
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)
      throw new Error('Failed to send message')
    }
  }

  async predict(
    chatflowId: string,
    question: string,
    sessionId?: string,
    overrideConfig?: Record<string, any>
  ): Promise<FlowiseResponse> {
    return this.sendMessage(chatflowId, {
      question,
      sessionId,
      overrideConfig,
    })
  }
}

export const flowiseClient = new FlowiseClient()
export default FlowiseClient
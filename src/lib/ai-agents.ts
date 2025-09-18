import { ChatOpenAI } from '@langchain/openai'
import { ConversationChain } from 'langchain/chains'
import { BufferMemory } from 'langchain/memory'
import { PromptTemplate } from '@langchain/core/prompts'

export class AIAgent {
  private model: ChatOpenAI | null
  private chain: ConversationChain | null = null
  private memory: BufferMemory
  private demoMode: boolean = false

  constructor(
    temperature: number = 0.7,
    modelName: string = 'gpt-3.5-turbo',
    systemPrompt?: string
  ) {
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey || apiKey === 'your-openai-api-key-here' || apiKey === 'demo-mode') {
      console.warn('OpenAI API key not configured. Running in demo mode.')
      this.demoMode = true
      this.model = null
      this.chain = null
      this.memory = new BufferMemory()
      return
    }

    this.model = new ChatOpenAI({
      temperature,
      modelName,
      openAIApiKey: apiKey,
    })

    this.memory = new BufferMemory()

    const prompt = PromptTemplate.fromTemplate(
      systemPrompt || `
      You are an intelligent AI assistant integrated into a comprehensive AI/ML platform.
      You have access to various AI capabilities including:
      - Document analysis and processing
      - Data preprocessing and analysis
      - Machine learning model insights
      - Code generation and optimization
      - Workflow automation

      Current conversation:
      {history}
      Human: {input}
      AI: `
    )

    if (this.model) {
      this.chain = new ConversationChain({
        llm: this.model,
        memory: this.memory,
        prompt,
      })
    }
  }

  async chat(input: string): Promise<string> {
    // Demo mode responses when API key is not configured
    if (this.demoMode) {
      const demoResponses: Record<string, string> = {
        'hi': 'Hello! How can I help you with your AI/ML project today?',
        'hello': 'Hi there! Welcome to the AI/ML platform. What would you like to work on?',
        'help': 'I can assist you with code analysis, data insights, document processing, ML recommendations, and workflow automation. What interests you?',
        'code': 'I can help with code review, optimization, debugging, algorithm recommendations, and explaining complex sections. Share your code!',
        'data': 'Great! I can help with data exploration, preprocessing, visualization, statistical analysis, and feature engineering. What data are you working with?',
        'machine learning': 'Excellent! I can assist with model selection, hyperparameter tuning, feature engineering, evaluation, and deployment strategies. What is your ML challenge?',
        'error': 'I can help debug that! Let me examine the error, check dependencies, review logic, and suggest fixes. Share the error details.',
        'optimize': 'I would love to help optimize your solution! I look for algorithm efficiency, code structure, resource usage, and caching strategies. What needs optimization?',
        'recommend': 'I can provide recommendations for tools, libraries, architecture patterns, best practices, and learning resources. What area interests you?'
      }
      
      const inputLower = input.toLowerCase()
      
      // Check for specific keywords
      for (const [keyword, response] of Object.entries(demoResponses)) {
        if (inputLower.includes(keyword)) {
          return response
        }
      }
      
      // Default intelligent response
      return `That's an interesting question about "${input}". I'm here to help with your AI/ML development needs. I can assist with technical analysis, solution design, code review, and learning support. What are you trying to accomplish?`
    }

    try {
      if (!this.chain) {
        throw new Error('AI chain not initialized')
      }
      
      const response = await this.chain.call({ input })
      return response.response
    } catch (error) {
      console.error('AI Agent Error:', error)
      
      // Provide a helpful fallback response when API is not available
      if (error instanceof Error && (error.message.includes('API key') || error.message.includes('401'))) {
        return `I apologize, but the AI service is currently unavailable due to configuration issues. 

To enable AI functionality, please:
1. Set up a valid OpenAI API key in your .env file
2. Replace 'your-openai-api-key-here' with your actual API key
3. Restart the application

Your message was: "${input}"`
      }
      
      throw new Error('Failed to process your request')
    }
  }

  async clearMemory(): Promise<void> {
    this.memory.clear()
  }

  async getMemory(): Promise<string> {
    return this.memory.loadMemoryVariables({}).then(vars => vars.history || '')
  }
}

export class SpecializedAIAgent extends AIAgent {
  constructor(
    agentType: 'data-analyst' | 'code-assistant' | 'document-processor' | 'ml-engineer',
    temperature: number = 0.7
  ) {
    const prompts = {
      'data-analyst': `
        You are a specialized Data Analysis AI Agent. Your expertise includes:
        - Statistical analysis and interpretation
        - Data visualization recommendations
        - Pattern recognition in datasets
        - Predictive modeling suggestions
        - Data quality assessment
        
        Current conversation:
        {history}
        Human: {input}
        Data Analyst AI: `,
      
      'code-assistant': `
        You are a specialized Code Assistant AI Agent. Your expertise includes:
        - Code generation and optimization
        - Debugging and error resolution
        - Best practices recommendations
        - API integration guidance
        - Framework-specific solutions
        
        Current conversation:
        {history}
        Human: {input}
        Code Assistant AI: `,
      
      'document-processor': `
        You are a specialized Document Processing AI Agent. Your expertise includes:
        - Document analysis and summarization
        - Information extraction
        - Content classification
        - Text preprocessing
        - Document comparison and analysis
        
        Current conversation:
        {history}
        Human: {input}
        Document Processor AI: `,
      
      'ml-engineer': `
        You are a specialized ML Engineering AI Agent. Your expertise includes:
        - Model architecture recommendations
        - Hyperparameter tuning strategies
        - Model deployment and monitoring
        - Feature engineering
        - Performance optimization
        
        Current conversation:
        {history}
        Human: {input}
        ML Engineer AI: `,
    }

    super(temperature, 'gpt-3.5-turbo', prompts[agentType])
  }
}

export const agentTypes = [
  'data-analyst',
  'code-assistant', 
  'document-processor',
  'ml-engineer'
] as const

export type AgentType = typeof agentTypes[number]
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from '@langchain/core/documents'
import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { StringOutputParser } from '@langchain/core/output_parsers'

export interface RAGDocument {
  id: string
  content: string
  metadata: Record<string, any>
  embedding?: number[]
}

export class RAGService {
  private embeddings: OpenAIEmbeddings | null
  private vectorStore: MemoryVectorStore | null = null
  private llm: ChatOpenAI | null
  private textSplitter: RecursiveCharacterTextSplitter
  private demoMode: boolean = false
  private demoDocuments: RAGDocument[] = []

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey || apiKey === 'your-openai-api-key-here' || apiKey === 'demo-mode') {
      console.warn('OpenAI API key not configured. RAG system running in demo mode.')
      this.demoMode = true
      this.embeddings = null
      this.llm = null
    } else {
      this.embeddings = new OpenAIEmbeddings({
        openAIApiKey: apiKey,
        modelName: 'text-embedding-ada-002',
      })

      this.llm = new ChatOpenAI({
        openAIApiKey: apiKey,
        modelName: 'gpt-3.5-turbo',
        temperature: 0.3,
      })
    }

    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })

    // Add demo documents for demo mode
    if (this.demoMode) {
      this.demoDocuments = [
        {
          id: 'demo-1',
          content: 'The AI/ML Flowise Platform is a comprehensive solution for building and deploying AI workflows. It integrates with various AI services and provides a visual interface for creating complex AI applications.',
          metadata: { source: 'demo', title: 'Platform Overview' }
        },
        {
          id: 'demo-2', 
          content: 'Machine Learning models can be trained using TensorFlow.js for client-side inference. This allows for real-time predictions without server round trips, improving user experience and reducing latency.',
          metadata: { source: 'demo', title: 'ML Capabilities' }
        },
        {
          id: 'demo-3',
          content: 'RAG (Retrieval-Augmented Generation) combines information retrieval with language generation. It searches through documents to find relevant context and uses that information to generate accurate, contextual responses.',
          metadata: { source: 'demo', title: 'RAG Technology' }
        },
        {
          id: 'demo-4',
          content: 'The platform supports various authentication methods including OAuth 2.0, SSO, and guest access. Security is implemented at multiple layers with proper token validation and session management.',
          metadata: { source: 'demo', title: 'Security Features' }
        }
      ]
    }
  }

  async addDocuments(documents: RAGDocument[]): Promise<void> {
    if (this.demoMode) {
      // In demo mode, just add to demo documents array
      this.demoDocuments.push(...documents)
      return
    }

    if (!this.embeddings) {
      throw new Error('Embeddings not initialized')
    }

    const docs = await Promise.all(
      documents.map(async (doc) => {
        const chunks = await this.textSplitter.splitText(doc.content)
        return chunks.map(
          (chunk, index) =>
            new Document({
              pageContent: chunk,
              metadata: {
                ...doc.metadata,
                docId: doc.id,
                chunkIndex: index,
              },
            })
        )
      })
    )

    const flatDocs = docs.flat()

    if (!this.vectorStore) {
      this.vectorStore = await MemoryVectorStore.fromDocuments(
        flatDocs,
        this.embeddings
      )
    } else {
      await this.vectorStore.addDocuments(flatDocs)
    }
  }

  async addDocument(content: string, metadata: Record<string, any> = {}): Promise<void> {
    const doc: RAGDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      metadata,
    }

    await this.addDocuments([doc])
  }

  async addTextFile(text: string, filename: string): Promise<void> {
    await this.addDocument(text, {
      source: 'file',
      filename,
      type: 'text',
      addedAt: new Date().toISOString(),
    })
  }

  async search(query: string, k: number = 5): Promise<Document[]> {
    if (this.demoMode) {
      // In demo mode, return demo documents that match the query
      const matchingDocs = this.demoDocuments
        .filter(doc => 
          doc.content.toLowerCase().includes(query.toLowerCase()) ||
          doc.metadata.title?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, k)
        .map(doc => new Document({
          pageContent: doc.content,
          metadata: doc.metadata
        }))
      
      // If no matches, return all demo docs
      if (matchingDocs.length === 0) {
        return this.demoDocuments.slice(0, k).map(doc => new Document({
          pageContent: doc.content,
          metadata: doc.metadata
        }))
      }
      
      return matchingDocs
    }

    if (!this.vectorStore) {
      throw new Error('No documents added to vector store')
    }

    return await this.vectorStore.similaritySearch(query, k)
  }

  async generateAnswer(
    question: string,
    context?: string,
    includeContext: boolean = true
  ): Promise<string> {
    // Demo mode responses
    if (this.demoMode) {
      const demoResponses: Record<string, string> = {
        'what is rag': 'RAG (Retrieval-Augmented Generation) is a technique that combines information retrieval with text generation. It searches through a knowledge base to find relevant documents and uses that information to generate accurate, contextual responses.',
        'how does machine learning work': 'Machine Learning works by training algorithms on data to recognize patterns and make predictions. In this platform, we use TensorFlow.js for client-side ML, allowing real-time inference without server dependencies.',
        'what is flowise': 'Flowise is a visual tool for building AI workflows and applications. It provides a drag-and-drop interface to create complex AI pipelines without extensive coding.',
        'authentication': 'The platform supports multiple authentication methods including OAuth 2.0, SSO, and guest access. Security is implemented with proper token validation and session management.',
        'default': `Based on the available knowledge base, I can provide information about: ${question}

The AI/ML Flowise Platform integrates various AI technologies including RAG, machine learning models, and visual workflow builders. It's designed for building comprehensive AI applications with modern security and scalability features.

This platform supports various use cases from data analysis to workflow automation. What specific aspect would you like to know more about?`
      }
      
      const key = question.toLowerCase()
      for (const [keyword, response] of Object.entries(demoResponses)) {
        if (key.includes(keyword)) {
          return response
        }
      }
      return demoResponses.default
    }

    if (!this.llm) {
      throw new Error('LLM not initialized')
    }

    let relevantDocs: Document[] = []
    
    if (includeContext && this.vectorStore) {
      relevantDocs = await this.search(question, 5)
    }

    const contextText = context || relevantDocs.map(doc => doc.pageContent).join('\n\n')

    const prompt = PromptTemplate.fromTemplate(`
      You are an AI assistant with access to a knowledge base. Use the provided context to answer the question accurately and comprehensively.

      Context:
      {context}

      Question: {question}

      Instructions:
      - Answer based primarily on the provided context
      - If the context doesn't contain enough information, say so clearly
      - Provide specific details when available
      - Cite relevant information from the context
      - Be concise but thorough

      Answer:
    `)

    const chain = RunnableSequence.from([
      prompt,
      this.llm,
      new StringOutputParser(),
    ])

    return await chain.invoke({
      question,
      context: contextText,
    })
  }

  async conversationalRAG(
    question: string,
    chatHistory: Array<{ human: string; ai: string }> = []
  ): Promise<{ answer: string; sources: Document[] }> {
    // Demo mode
    if (this.demoMode) {
      const sources = await this.search(question, 3)
      const answer = await this.generateAnswer(question, '', true)
      return { answer, sources }
    }

    if (!this.vectorStore) {
      throw new Error('No documents added to vector store')
    }

    if (!this.llm) {
      throw new Error('LLM not initialized')
    }

    // Create a context-aware query by combining current question with recent history
    const historyText = chatHistory
      .slice(-3) // Last 3 exchanges
      .map(exchange => `Human: ${exchange.human}\nAI: ${exchange.ai}`)
      .join('\n')

    const contextualQuery = historyText 
      ? `Previous conversation:\n${historyText}\n\nCurrent question: ${question}`
      : question

    const relevantDocs = await this.search(contextualQuery, 5)
    const context = relevantDocs.map(doc => doc.pageContent).join('\n\n')

    const prompt = PromptTemplate.fromTemplate(`
      You are having a conversation with a user. Use the provided context and conversation history to give a helpful, accurate response.

      Context from knowledge base:
      {context}

      Conversation history:
      {history}

      Current question: {question}

      Instructions:
      - Consider the conversation flow and context
      - Use information from the knowledge base when relevant
      - Maintain conversational tone
      - Reference previous exchanges when appropriate
      - If you can't answer based on available context, say so

      Response:
    `)

    const chain = RunnableSequence.from([
      prompt,
      this.llm,
      new StringOutputParser(),
    ])

    const answer = await chain.invoke({
      question,
      context,
      history: historyText,
    })

    return {
      answer,
      sources: relevantDocs,
    }
  }

  async summarizeDocuments(query?: string): Promise<string> {
    // Demo mode
    if (this.demoMode) {
      return `Summary of Available Documents:

• Platform Overview: The AI/ML Flowise Platform provides comprehensive AI workflow capabilities
• ML Capabilities: Client-side machine learning using TensorFlow.js for real-time inference
• RAG Technology: Advanced retrieval-augmented generation for contextual responses
• Security Features: Multi-layer authentication with OAuth 2.0 and SSO support

The platform integrates modern AI technologies with user-friendly interfaces and enterprise-grade security. It's designed for building scalable AI applications with visual workflow management.`
    }

    if (!this.vectorStore) {
      throw new Error('No documents added to vector store')
    }

    if (!this.llm) {
      throw new Error('LLM not initialized')
    }

    const docs = query 
      ? await this.search(query, 10)
      : await this.vectorStore.similaritySearch('', 10)

    const content = docs.map(doc => doc.pageContent).join('\n\n')

    const prompt = PromptTemplate.fromTemplate(`
      Provide a comprehensive summary of the following documents:

      {content}

      Create a structured summary that includes:
      - Main topics and themes
      - Key insights and findings
      - Important details and data points
      - Overall conclusions

      Summary:
    `)

    const chain = RunnableSequence.from([
      prompt,
      this.llm,
      new StringOutputParser(),
    ])

    return await chain.invoke({ content })
  }

  getVectorStoreStats(): { documentCount: number; hasStore: boolean; demoMode: boolean } {
    if (this.demoMode) {
      return {
        hasStore: true,
        documentCount: this.demoDocuments.length,
        demoMode: true
      }
    }

    return {
      hasStore: this.vectorStore !== null,
      documentCount: this.vectorStore ? 
        (this.vectorStore as any).memoryVectors?.length || 0 : 0,
      demoMode: false
    }
  }

  clearVectorStore(): void {
    if (this.demoMode) {
      // Reset to original demo documents
      this.demoDocuments = [
        {
          id: 'demo-1',
          content: 'The AI/ML Flowise Platform is a comprehensive solution for building and deploying AI workflows. It integrates with various AI services and provides a visual interface for creating complex AI applications.',
          metadata: { source: 'demo', title: 'Platform Overview' }
        },
        {
          id: 'demo-2', 
          content: 'Machine Learning models can be trained using TensorFlow.js for client-side inference. This allows for real-time predictions without server round trips, improving user experience and reducing latency.',
          metadata: { source: 'demo', title: 'ML Capabilities' }
        },
        {
          id: 'demo-3',
          content: 'RAG (Retrieval-Augmented Generation) combines information retrieval with language generation. It searches through documents to find relevant context and uses that information to generate accurate, contextual responses.',
          metadata: { source: 'demo', title: 'RAG Technology' }
        },
        {
          id: 'demo-4',
          content: 'The platform supports various authentication methods including OAuth 2.0, SSO, and guest access. Security is implemented at multiple layers with proper token validation and session management.',
          metadata: { source: 'demo', title: 'Security Features' }
        }
      ]
    } else {
      this.vectorStore = null
    }
  }
}

export const ragService = new RAGService()
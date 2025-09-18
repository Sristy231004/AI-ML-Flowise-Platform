# AI/ML Flowise Platform

A comprehensive AI/ML platform demonstrating integration of modern AI technologies, SSO authentication, and intelligent features for the AI/ML + Flowise Intern role.

## 🚀 Project Overview

This project showcases:
- **Single Sign-On (SSO)** with OAuth 2.0 & OpenID Connect
- **AI Agents** powered by LangChain and OpenAI
- **Flowise Integration** for visual AI workflows
- **Machine Learning Models** with TensorFlow.js
- **RAG (Retrieval-Augmented Generation)** system
- **Data Preprocessing** and analysis tools

## 🛠 Technology Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** for accessible components

### AI/ML
- **LangChain** for AI agent orchestration
- **TensorFlow.js** for client-side ML
- **OpenAI API** for language models
- **Vector Embeddings** for RAG system

### Authentication
- **NextAuth.js** for authentication
- **OAuth 2.0** protocols
- **OpenID Connect** support
- **Multi-provider SSO** (Google, GitHub, Azure AD)

### Database & Storage
- **Prisma ORM** for database operations
- **SQLite** for development
- **Vector Store** for embeddings

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── agents/        # AI agent endpoints
│   │   ├── auth/          # Authentication endpoints
│   │   ├── flowise/       # Flowise integration
│   │   ├── ml/            # ML model endpoints
│   │   └── rag/           # RAG system endpoints
│   ├── auth/              # Authentication pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # Base UI components
│   ├── ai-agent-chat.tsx  # AI agent interface
│   ├── dashboard.tsx      # Main dashboard
│   ├── flowise-chat.tsx   # Flowise interface
│   ├── ml-model-demo.tsx  # ML demonstration
│   ├── rag-demo.tsx       # RAG demonstration
│   └── data-preprocessor.tsx # Data processing tools
├── hooks/                 # Custom React hooks
│   ├── useAIAgent.ts      # AI agent hook
│   ├── useFlowise.ts      # Flowise integration hook
│   ├── useMLService.ts    # ML service hook
│   └── useRAG.ts          # RAG system hook
├── lib/                   # Core libraries
│   ├── ai-agents.ts       # AI agent implementations
│   ├── auth.ts            # Authentication configuration
│   ├── flowise.ts         # Flowise client
│   ├── rag.ts             # RAG service
│   ├── tensorflow.ts      # TensorFlow service
│   └── utils.ts           # Utility functions
├── types/                 # TypeScript definitions
└── utils/                 # Utility functions
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-ml-flowise-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables:
   ```env
   # Authentication
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   
   # OpenAI
   OPENAI_API_KEY=your-openai-api-key
   
   # Flowise
   FLOWISE_API_URL=http://localhost:3001
   FLOWISE_API_KEY=your-flowise-api-key
   
   # OAuth Providers
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   AZURE_AD_CLIENT_ID=your-azure-ad-client-id
   AZURE_AD_CLIENT_SECRET=your-azure-ad-client-secret
   AZURE_AD_TENANT_ID=your-azure-ad-tenant-id
   
   # Database
   DATABASE_URL="file:./dev.db"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Set up Flowise (Optional)**
   ```bash
   npm install -g flowise
   npx flowise start
   ```

## 🎯 Features

### 1. SSO Authentication
- **Multi-provider support**: Google, GitHub, Azure AD
- **OAuth 2.0 & OpenID Connect** protocols
- **Session management** with NextAuth.js
- **Secure token handling**

### 2. AI Agents
- **Specialized agents**: Data Analyst, Code Assistant, Document Processor, ML Engineer
- **Memory management** for conversation context
- **LangChain integration** for advanced AI capabilities
- **Real-time chat interface**

### 3. Flowise Integration
- **Visual workflow builder** integration
- **Chatflow management** and execution
- **API connectivity** with Flowise instance
- **Real-time predictions**

### 4. Machine Learning Models
- **TensorFlow.js** for client-side ML
- **Neural network creation** and training
- **Text classification** with embedding models
- **Data preprocessing** and normalization

### 5. RAG System
- **Document embedding** and storage
- **Vector similarity search**
- **Context-aware answer generation**
- **Conversational RAG** with memory

### 6. Data Preprocessing
- **Statistical analysis** and insights
- **Data normalization** and scaling
- **Outlier detection** and cleaning
- **CSV data processing**

## 🔗 API Endpoints

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### AI Agents
- `POST /api/agents` - Chat with AI agents
- `GET /api/agents` - Get agent memory
- `DELETE /api/agents` - Clear agent session

### Flowise
- `GET /api/flowise` - List chatflows
- `POST /api/flowise` - Send message to chatflow
- `GET /api/flowise/[chatflowId]` - Get specific chatflow
- `POST /api/flowise/[chatflowId]` - Execute chatflow

### Machine Learning
- `POST /api/ml` - ML operations (predict, preprocess, createModel)

### RAG System
- `GET /api/rag` - Get vector store stats
- `POST /api/rag` - RAG operations (add documents, search, Q&A)
- `DELETE /api/rag` - Clear vector store

## 💡 Usage Examples

### AI Agent Chat
```typescript
import { useAIAgent } from '@/hooks/useAIAgent'

const { messages, sendMessage } = useAIAgent('session-123')
await sendMessage('Analyze this dataset', 'data-analyst')
```

### Flowise Integration
```typescript
import { useFlowise } from '@/hooks/useFlowise'

const { chatflows, sendMessage } = useFlowise()
await sendMessage(chatflowId, 'Hello, Flowise!')
```

### RAG System
```typescript
import { useRAG } from '@/hooks/useRAG'

const { addDocument, generateAnswer } = useRAG()
await addDocument('Your document content here')
const answer = await generateAnswer('What is this document about?')
```

### ML Models
```typescript
import { useMLService } from '@/hooks/useMLService'

const { createModel, predict } = useMLService()
const model = await createModel({ type: 'neural', inputShape: 3 })
const result = await predict([[1, 2, 3]], modelUrl)
```

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Manual Testing
1. Sign in with different OAuth providers
2. Test AI agent conversations
3. Upload documents to RAG system
4. Create and train ML models
5. Process data with preprocessing tools

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push

### Docker
```bash
docker build -t ai-ml-platform .
docker run -p 3000:3000 ai-ml-platform
```

### Manual Deployment
```bash
npm run build
npm start
```

## 🔒 Security Considerations

- **Environment variables**: Never commit secrets to version control
- **API keys**: Rotate regularly and use least privilege access
- **Authentication**: Validate all auth tokens and sessions
- **Input validation**: Sanitize all user inputs
- **CORS**: Configure appropriate CORS policies

## 📚 Learning Resources

### AI/ML
- [LangChain Documentation](https://docs.langchain.com/)
- [TensorFlow.js Guide](https://www.tensorflow.org/js)
- [OpenAI API Documentation](https://platform.openai.com/docs)

### Authentication
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [OpenID Connect](https://openid.net/connect/)

### Flowise
- [Flowise Documentation](https://docs.flowiseai.com/)
- [Visual AI Workflows](https://github.com/FlowiseAI/Flowise)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For questions or issues:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed description
4. Contact the development team

## 🎯 Future Enhancements

# AI-ML-Flowise-Platform
>>>>>>> 29e9783adb51e690afc3aeef713cbf2ce47756ba
- [ ] Advanced ML model training interface
- [ ] Real-time collaboration features
- [ ] Enhanced data visualization
- [ ] Multi-language support
- [ ] Performance monitoring dashboard
- [ ] Advanced RAG features (document chunking strategies)
- [ ] Integration with more AI providers
- [ ] Mobile-responsive design improvements
=======
# AI-ML-Flowise-Platform
>>>>>>> 29e9783adb51e690afc3aeef713cbf2ce47756ba

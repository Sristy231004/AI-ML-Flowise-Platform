'use client'

import { useState, useEffect } from 'react'
import { useFlowise, useFlowiseChat } from '@/hooks/useFlowise'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function FlowiseChat() {
  const { chatflows, loading: flowsLoading, error: flowsError } = useFlowise()
  const [selectedChatflow, setSelectedChatflow] = useState<string>('')
  const [message, setMessage] = useState('')
  
  const {
    messages,
    loading: chatLoading,
    sendMessage,
    clearMessages,
  } = useFlowiseChat(selectedChatflow)

  useEffect(() => {
    if (chatflows.length > 0 && !selectedChatflow) {
      setSelectedChatflow(chatflows[0].id)
    }
  }, [chatflows, selectedChatflow])

  const handleSend = async () => {
    if (!message.trim() || !selectedChatflow) return
    await sendMessage(message)
    setMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🌊 Flowise Integration</CardTitle>
          <CardDescription>
            Connect to your Flowise chatflows for visual AI workflow execution
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Chatflow Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Select Chatflow:</h3>
            
            {flowsLoading && (
              <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
            )}
            
            {flowsError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg">
                <strong>Connection Error:</strong> {flowsError}
                <div className="text-sm mt-1">
                  Make sure Flowise is running on <code>http://localhost:3001</code>
                </div>
              </div>
            )}
            
            {!flowsLoading && !flowsError && (
              <div className="space-y-3">
                {chatflows.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg">
                    <strong>No Chatflows Found</strong>
                    <div className="text-sm mt-1">
                      Create a chatflow in Flowise first, or check your API connection.
                    </div>
                  </div>
                ) : (
                  <select
                    value={selectedChatflow}
                    onChange={(e) => setSelectedChatflow(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    {chatflows.map((flow) => (
                      <option key={flow.id} value={flow.id}>
                        {flow.name} {flow.deployed ? '✅' : '⚠️ Not Deployed'}
                      </option>
                    ))}
                  </select>
                )}
                
                {selectedChatflow && (
                  <div className="text-sm text-gray-600">
                    <strong>Selected:</strong> {chatflows.find(f => f.id === selectedChatflow)?.name}
                    <br />
                    <strong>Status:</strong> {chatflows.find(f => f.id === selectedChatflow)?.deployed ? 'Deployed ✅' : 'Not Deployed ⚠️'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Interface */}
          {selectedChatflow && (
            <>
              {/* Chat Messages */}
              <div className="border rounded-lg h-96 overflow-y-auto p-4 bg-gray-50 mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <div className="text-4xl mb-2">🌊</div>
                    <p>Start chatting with your Flowise workflow!</p>
                    <p className="text-sm mt-2">
                      Your messages will be processed through the visual AI pipeline.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border'
                          }`}
                        >
                          <div className="text-sm">{msg.text}</div>
                          <div className="text-xs opacity-50 mt-1">
                            {msg.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white border p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message to the Flowise chatflow..."
                  className="flex-1 p-3 border rounded-lg resize-none"
                  rows={2}
                  disabled={chatLoading}
                />
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={handleSend}
                    disabled={chatLoading || !message.trim()}
                    className="px-6"
                  >
                    Send
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearMessages}
                    disabled={chatLoading}
                    className="px-6"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Flowise Setup Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">🔧 Flowise Setup Instructions:</h4>
            <div className="text-sm space-y-2">
              <div><strong>1.</strong> Install Flowise: <code>npm install -g flowise</code></div>
              <div><strong>2.</strong> Start Flowise: <code>npx flowise start</code></div>
              <div><strong>3.</strong> Access Flowise UI: <code>http://localhost:3001</code></div>
              <div><strong>4.</strong> Create a chatflow and deploy it</div>
              <div><strong>5.</strong> Set your API key in the environment variables</div>
            </div>
            <div className="mt-3 p-2 bg-white rounded border">
              <strong>Environment Variables:</strong>
              <pre className="text-xs">
{`FLOWISE_API_URL=http://localhost:3001
FLOWISE_API_KEY=your-api-key-here`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
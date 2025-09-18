'use client'

import { useState } from 'react'
import { useMLService, useDataAnalysis } from '@/hooks/useMLService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function MLModelDemo() {
  const { loading, error, predict, preprocessData, createModel, processText } = useMLService()
  const { loading: analysisLoading, error: analysisError, analyzeDataset } = useDataAnalysis()
  
  const [activeDemo, setActiveDemo] = useState<'neural' | 'text' | 'analysis'>('neural')
  const [results, setResults] = useState<any>(null)

  // Neural Network Demo
  const [neuralInput, setNeuralInput] = useState('1,2,3\n4,5,6\n7,8,9')
  
  // Text Classification Demo
  const [textInput, setTextInput] = useState('This is a great product!\nI hate this service.\nNeutral statement here.')
  
  // Data Analysis Demo
  const [analysisInput, setAnalysisInput] = useState('10,15,12\n20,25,22\n30,35,32\n40,45,42')

  const handleNeuralNetworkDemo = async () => {
    try {
      // Parse input data
      const inputData = neuralInput.split('\n').map(row => 
        row.split(',').map(val => parseFloat(val.trim()))
      ).filter(row => row.every(val => !isNaN(val)))

      if (inputData.length === 0) {
        setResults({ error: 'Invalid input data format' })
        return
      }

      // Create a simple neural network
      const modelResult = await createModel({
        type: 'neural',
        inputShape: inputData[0].length,
        outputSize: 1,
      })

      if (!modelResult) {
        setResults({ error: 'Failed to create model' })
        return
      }

      // Preprocess data
      const preprocessed = await preprocessData(inputData)
      
      setResults({
        type: 'neural',
        modelInfo: modelResult,
        preprocessed: preprocessed?.preprocessed,
        originalData: inputData,
      })
    } catch (err) {
      setResults({ error: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleTextClassificationDemo = async () => {
    try {
      const texts = textInput.split('\n').filter(text => text.trim().length > 0)
      
      if (texts.length === 0) {
        setResults({ error: 'No text data provided' })
        return
      }

      // Process text data
      const processed = await processText(texts, 'preprocess')
      
      if (!processed) {
        setResults({ error: 'Failed to process text' })
        return
      }

      // Create text classification model
      const modelResult = await createModel({
        type: 'textClassification',
        vocabSize: processed.vocabSize,
        embeddingDim: 50,
        maxLength: 100,
      })

      setResults({
        type: 'text',
        texts,
        vocabulary: processed.vocabulary?.slice(0, 20), // Show first 20 words
        vocabSize: processed.vocabSize,
        sequences: processed.sequences?.slice(0, 3), // Show first 3 sequences
        modelInfo: modelResult,
      })
    } catch (err) {
      setResults({ error: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const handleDataAnalysisDemo = async () => {
    try {
      const data = analysisInput.split('\n').map(row => 
        row.split(',').map(val => parseFloat(val.trim()))
      ).filter(row => row.every(val => !isNaN(val)))

      if (data.length === 0) {
        setResults({ error: 'Invalid data format' })
        return
      }

      const analysis = await analyzeDataset(data)
      
      setResults({
        type: 'analysis',
        data,
        analysis,
      })
    } catch (err) {
      setResults({ error: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  const demos = [
    { id: 'neural', label: '🧠 Neural Network', description: 'Create and train neural networks' },
    { id: 'text', label: '📝 Text Classification', description: 'Process and classify text data' },
    { id: 'analysis', label: '📊 Data Analysis', description: 'Analyze datasets for insights' },
  ] as const

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧠 Machine Learning Models</CardTitle>
          <CardDescription>
            Demonstrate TensorFlow.js integration and ML capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Demo Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {demos.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemo(demo.id)}
                  className={`p-4 rounded-lg text-left transition-all ${
                    activeDemo === demo.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{demo.label}</div>
                  <div className="text-sm opacity-75 mt-1">{demo.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Neural Network Demo */}
          {activeDemo === 'neural' && (
            <div className="space-y-4">
              <h3 className="font-medium">Neural Network Demo</h3>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Input Data (comma-separated values, one row per line):
                </label>
                <textarea
                  value={neuralInput}
                  onChange={(e) => setNeuralInput(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  rows={4}
                  placeholder="1,2,3
4,5,6
7,8,9"
                />
              </div>
              <Button 
                onClick={handleNeuralNetworkDemo}
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading ? 'Processing...' : 'Create Neural Network & Preprocess Data'}
              </Button>
            </div>
          )}

          {/* Text Classification Demo */}
          {activeDemo === 'text' && (
            <div className="space-y-4">
              <h3 className="font-medium">Text Classification Demo</h3>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Text Data (one sentence per line):
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  rows={4}
                  placeholder="This is a great product!
I hate this service.
Neutral statement here."
                />
              </div>
              <Button 
                onClick={handleTextClassificationDemo}
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading ? 'Processing...' : 'Process Text & Create Model'}
              </Button>
            </div>
          )}

          {/* Data Analysis Demo */}
          {activeDemo === 'analysis' && (
            <div className="space-y-4">
              <h3 className="font-medium">Data Analysis Demo</h3>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Dataset (comma-separated values, one row per line):
                </label>
                <textarea
                  value={analysisInput}
                  onChange={(e) => setAnalysisInput(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  rows={4}
                  placeholder="10,15,12
20,25,22
30,35,32
40,45,42"
                />
              </div>
              <Button 
                onClick={handleDataAnalysisDemo}
                disabled={analysisLoading}
                className="w-full md:w-auto"
              >
                {analysisLoading ? 'Analyzing...' : 'Analyze Dataset'}
              </Button>
            </div>
          )}

          {/* Error Display */}
          {(error || analysisError) && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg">
              <strong>Error:</strong> {error || analysisError}
            </div>
          )}

          {/* Results Display */}
          {results && (
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Results:</h3>
              
              {results.error ? (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg">
                  {results.error}
                </div>
              ) : (
                <div className="bg-gray-50 border rounded-lg p-4">
                  {results.type === 'neural' && (
                    <div className="space-y-3">
                      <div>
                        <strong>Model Created:</strong> Neural Network with {results.modelInfo?.layerCount} layers
                      </div>
                      <div>
                        <strong>Original Data:</strong>
                        <pre className="text-xs bg-white p-2 rounded mt-1">
                          {JSON.stringify(results.originalData, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <strong>Preprocessed Data:</strong>
                        <pre className="text-xs bg-white p-2 rounded mt-1">
                          {JSON.stringify(results.preprocessed?.slice(0, 3), null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {results.type === 'text' && (
                    <div className="space-y-3">
                      <div>
                        <strong>Text Classification Model:</strong> Created with vocabulary size {results.vocabSize}
                      </div>
                      <div>
                        <strong>Sample Vocabulary:</strong>
                        <div className="text-xs bg-white p-2 rounded mt-1">
                          {results.vocabulary?.map(([word, index]: [string, number]) => (
                            <span key={word} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1 mb-1">
                              {word}({index})
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <strong>Text Sequences (first 3):</strong>
                        <pre className="text-xs bg-white p-2 rounded mt-1">
                          {JSON.stringify(results.sequences, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {results.type === 'analysis' && results.analysis && (
                    <div className="space-y-3">
                      <div>
                        <strong>Statistics:</strong>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                          <div className="bg-white p-2 rounded">
                            <div className="text-xs text-gray-600">Mean</div>
                            <div className="font-medium">{results.analysis.statistics.mean}</div>
                          </div>
                          <div className="bg-white p-2 rounded">
                            <div className="text-xs text-gray-600">Std Dev</div>
                            <div className="font-medium">{results.analysis.statistics.standardDeviation}</div>
                          </div>
                          <div className="bg-white p-2 rounded">
                            <div className="text-xs text-gray-600">Min/Max</div>
                            <div className="font-medium">{results.analysis.statistics.minimum} / {results.analysis.statistics.maximum}</div>
                          </div>
                          <div className="bg-white p-2 rounded">
                            <div className="text-xs text-gray-600">Outliers</div>
                            <div className="font-medium">{results.analysis.patterns.outliersPercent}%</div>
                          </div>
                        </div>
                      </div>
                      
                      {results.analysis.patterns.trends && (
                        <div>
                          <strong>Trend:</strong> {results.analysis.patterns.trends}
                        </div>
                      )}
                      
                      {results.analysis.insights.length > 0 && (
                        <div>
                          <strong>Insights:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {results.analysis.insights.map((insight: string, index: number) => (
                              <li key={index} className="text-sm">{insight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">💡 How it works:</h4>
            <div className="text-sm space-y-1">
              <div><strong>Neural Network:</strong> Creates a simple feedforward network and preprocesses input data</div>
              <div><strong>Text Classification:</strong> Tokenizes text, builds vocabulary, and creates embedding-based model</div>
              <div><strong>Data Analysis:</strong> Performs statistical analysis, outlier detection, and trend analysis</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
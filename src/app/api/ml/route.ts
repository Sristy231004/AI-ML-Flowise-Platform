import { NextRequest, NextResponse } from 'next/server'
import { tensorflowService, DataPreprocessor } from '@/lib/tensorflow'

export async function POST(request: NextRequest) {
  try {
    const { action, data, modelConfig } = await request.json()

    switch (action) {
      case 'predict':
        return await handlePredict(data)
      
      case 'preprocess':
        return await handlePreprocess(data)
      
      case 'createModel':
        return await handleCreateModel(modelConfig)
      
      case 'textClassification':
        return await handleTextClassification(data)
      
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('ML API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process ML request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

async function handlePredict(data: { input: number[][], modelUrl?: string }) {
  const { input, modelUrl } = data

  if (!input || !Array.isArray(input)) {
    return NextResponse.json(
      { error: 'Invalid input data' },
      { status: 400 }
    )
  }

  if (modelUrl) {
    await tensorflowService.loadModel(modelUrl)
  }

  const predictions = await tensorflowService.predict(input)

  return NextResponse.json({
    predictions,
    success: true,
  })
}

async function handlePreprocess(data: { values: number[][] }) {
  const { values } = data

  if (!values || !Array.isArray(values)) {
    return NextResponse.json(
      { error: 'Invalid values data' },
      { status: 400 }
    )
  }

  const preprocessed = await tensorflowService.preprocessData(values)
  const result = await preprocessed.array()
  preprocessed.dispose()

  return NextResponse.json({
    preprocessed: result,
    success: true,
  })
}

async function handleCreateModel(config: {
  type: 'neural' | 'textClassification'
  inputShape?: number
  outputSize?: number
  vocabSize?: number
  embeddingDim?: number
  maxLength?: number
}) {
  const { type, inputShape, outputSize, vocabSize, embeddingDim, maxLength } = config

  let model

  if (type === 'neural') {
    if (!inputShape) {
      return NextResponse.json(
        { error: 'inputShape is required for neural network' },
        { status: 400 }
      )
    }
    model = await tensorflowService.createSimpleNeuralNetwork(inputShape, outputSize)
  } else if (type === 'textClassification') {
    if (!vocabSize) {
      return NextResponse.json(
        { error: 'vocabSize is required for text classification' },
        { status: 400 }
      )
    }
    model = await tensorflowService.createTextClassificationModel(
      vocabSize,
      embeddingDim,
      maxLength
    )
  } else {
    return NextResponse.json(
      { error: 'Invalid model type' },
      { status: 400 }
    )
  }

  return NextResponse.json({
    modelSummary: model.summary(),
    layerCount: model.layers.length,
    success: true,
  })
}

async function handleTextClassification(data: {
  texts: string[]
  labels?: number[]
  action: 'preprocess' | 'createVocab'
}) {
  const { texts, labels, action } = data

  if (!texts || !Array.isArray(texts)) {
    return NextResponse.json(
      { error: 'Invalid texts data' },
      { status: 400 }
    )
  }

  if (action === 'createVocab') {
    const vocab = DataPreprocessor.createVocabulary(texts)
    const vocabArray = Array.from(vocab.entries())

    return NextResponse.json({
      vocabulary: vocabArray,
      vocabSize: vocab.size,
      success: true,
    })
  }

  if (action === 'preprocess') {
    const vocab = DataPreprocessor.createVocabulary(texts)
    const sequences = texts.map(text => 
      DataPreprocessor.textToSequence(text, vocab, 100)
    )

    return NextResponse.json({
      sequences,
      vocabulary: Array.from(vocab.entries()),
      vocabSize: vocab.size,
      success: true,
    })
  }

  return NextResponse.json(
    { error: 'Invalid action for text classification' },
    { status: 400 }
  )
}
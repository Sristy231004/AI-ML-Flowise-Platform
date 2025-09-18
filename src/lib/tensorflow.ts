import * as tf from '@tensorflow/tfjs'

export class TensorFlowService {
  private model: tf.LayersModel | null = null

  async loadModel(modelUrl: string): Promise<void> {
    try {
      this.model = await tf.loadLayersModel(modelUrl)
      console.log('Model loaded successfully')
    } catch (error) {
      console.error('Error loading model:', error)
      throw new Error('Failed to load TensorFlow model')
    }
  }

  async predict(inputData: number[][]): Promise<number[][]> {
    if (!this.model) {
      throw new Error('Model not loaded. Call loadModel() first.')
    }

    try {
      const prediction = this.model.predict(tf.tensor2d(inputData)) as tf.Tensor
      const result = await prediction.data()
      prediction.dispose()
      return Array.from(result).map(val => [val])
    } catch (error) {
      console.error('Prediction error:', error)
      throw new Error('Failed to make prediction')
    }
  }

  async createTextClassificationModel(
    vocabSize: number,
    embeddingDim: number = 100,
    maxLength: number = 100
  ): Promise<tf.LayersModel> {
    const model = tf.sequential({
      layers: [
        tf.layers.embedding({
          inputDim: vocabSize,
          outputDim: embeddingDim,
          inputLength: maxLength,
        }),
        tf.layers.globalAveragePooling1d(),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.5 }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' }),
      ],
    })

    model.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    })

    return model
  }

  async createSimpleNeuralNetwork(inputShape: number, outputSize: number = 1): Promise<tf.LayersModel> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [inputShape],
          units: 64,
          activation: 'relu',
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: 32,
          activation: 'relu',
        }),
        tf.layers.dense({
          units: outputSize,
          activation: outputSize === 1 ? 'sigmoid' : 'softmax',
        }),
      ],
    })

    model.compile({
      optimizer: 'adam',
      loss: outputSize === 1 ? 'binaryCrossentropy' : 'categoricalCrossentropy',
      metrics: ['accuracy'],
    })

    return model
  }

  async preprocessData(data: number[][]): Promise<tf.Tensor2D> {
    // Normalize data to [0, 1] range
    const tensor = tf.tensor2d(data)
    const min = tensor.min()
    const max = tensor.max()
    const normalized = tensor.sub(min).div(max.sub(min))
    
    // Clean up intermediate tensors
    tensor.dispose()
    min.dispose()
    max.dispose()
    
    return normalized as tf.Tensor2D
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose()
      this.model = null
    }
  }
}

export class DataPreprocessor {
  static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim()
  }

  static tokenizeText(text: string): string[] {
    return this.normalizeText(text).split(/\s+/).filter(token => token.length > 0)
  }

  static createVocabulary(texts: string[]): Map<string, number> {
    const vocab = new Map<string, number>()
    let index = 1 // Start from 1, reserve 0 for padding

    texts.forEach(text => {
      const tokens = this.tokenizeText(text)
      tokens.forEach(token => {
        if (!vocab.has(token)) {
          vocab.set(token, index++)
        }
      })
    })

    return vocab
  }

  static textToSequence(text: string, vocab: Map<string, number>, maxLength: number = 100): number[] {
    const tokens = this.tokenizeText(text)
    const sequence = tokens
      .map(token => vocab.get(token) || 0)
      .slice(0, maxLength)
    
    // Pad sequence to maxLength
    while (sequence.length < maxLength) {
      sequence.push(0)
    }

    return sequence
  }

  static sequencesToTensor(sequences: number[][]): tf.Tensor2D {
    return tf.tensor2d(sequences)
  }
}

export const tensorflowService = new TensorFlowService()
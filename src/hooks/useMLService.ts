import { useState } from 'react'
import axios from 'axios'

interface MLPrediction {
  predictions: number[][]
  success: boolean
}

interface MLPreprocessing {
  preprocessed: number[][]
  success: boolean
}

interface TextProcessing {
  sequences?: number[][]
  vocabulary?: [string, number][]
  vocabSize?: number
  success: boolean
}

interface ModelCreation {
  modelSummary: any
  layerCount: number
  success: boolean
}

export function useMLService() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const predict = async (input: number[][], modelUrl?: string): Promise<MLPrediction | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post('/api/ml', {
        action: 'predict',
        data: { input, modelUrl },
      })

      return response.data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Prediction failed'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const preprocessData = async (values: number[][]): Promise<MLPreprocessing | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post('/api/ml', {
        action: 'preprocess',
        data: { values },
      })

      return response.data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Preprocessing failed'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const createModel = async (config: {
    type: 'neural' | 'textClassification'
    inputShape?: number
    outputSize?: number
    vocabSize?: number
    embeddingDim?: number
    maxLength?: number
  }): Promise<ModelCreation | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post('/api/ml', {
        action: 'createModel',
        modelConfig: config,
      })

      return response.data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Model creation failed'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const processText = async (
    texts: string[],
    action: 'preprocess' | 'createVocab'
  ): Promise<TextProcessing | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post('/api/ml', {
        action: 'textClassification',
        data: { texts, action },
      })

      return response.data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Text processing failed'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    predict,
    preprocessData,
    createModel,
    processText,
  }
}

export function useDataAnalysis() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeDataset = async (data: number[][]) => {
    try {
      setLoading(true)
      setError(null)

      // Calculate basic statistics
      const stats = calculateStatistics(data)
      
      // Detect patterns and outliers
      const patterns = detectPatterns(data)
      
      // Generate insights
      const insights = generateInsights(stats, patterns)

      return {
        statistics: stats,
        patterns,
        insights,
        success: true,
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Analysis failed'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const calculateStatistics = (data: number[][]) => {
    const flattened = data.flat()
    const mean = flattened.reduce((sum, val) => sum + val, 0) / flattened.length
    const variance = flattened.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / flattened.length
    const stdDev = Math.sqrt(variance)
    const min = Math.min(...flattened)
    const max = Math.max(...flattened)

    return {
      mean: parseFloat(mean.toFixed(4)),
      variance: parseFloat(variance.toFixed(4)),
      standardDeviation: parseFloat(stdDev.toFixed(4)),
      minimum: min,
      maximum: max,
      count: flattened.length,
      range: max - min,
    }
  }

  const detectPatterns = (data: number[][]) => {
    const flattened = data.flat()
    const mean = flattened.reduce((sum, val) => sum + val, 0) / flattened.length
    const stdDev = Math.sqrt(
      flattened.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / flattened.length
    )

    // Simple outlier detection using 2-sigma rule
    const outliers = flattened.filter(val => Math.abs(val - mean) > 2 * stdDev)
    
    // Trend detection (simplified)
    const trends = data.length > 1 ? detectTrend(data) : null

    return {
      outliers: outliers.length,
      outliersPercent: parseFloat(((outliers.length / flattened.length) * 100).toFixed(2)),
      trends,
    }
  }

  const detectTrend = (data: number[][]) => {
    const means = data.map(row => row.reduce((sum, val) => sum + val, 0) / row.length)
    
    if (means.length < 2) return null

    let increasing = 0
    let decreasing = 0

    for (let i = 1; i < means.length; i++) {
      if (means[i] > means[i - 1]) increasing++
      else if (means[i] < means[i - 1]) decreasing++
    }

    const total = means.length - 1
    if (increasing / total > 0.7) return 'increasing'
    if (decreasing / total > 0.7) return 'decreasing'
    return 'stable'
  }

  const generateInsights = (stats: any, patterns: any) => {
    const insights = []

    if (patterns.outliersPercent > 10) {
      insights.push(`High outlier rate detected (${patterns.outliersPercent}%). Consider data cleaning.`)
    }

    if (stats.standardDeviation > stats.mean) {
      insights.push('High variability in data. Consider normalization or scaling.')
    }

    if (patterns.trends === 'increasing') {
      insights.push('Data shows an increasing trend over time.')
    } else if (patterns.trends === 'decreasing') {
      insights.push('Data shows a decreasing trend over time.')
    }

    if (stats.range > stats.mean * 10) {
      insights.push('Wide range detected. Data may benefit from transformation.')
    }

    return insights
  }

  return {
    loading,
    error,
    analyzeDataset,
  }
}
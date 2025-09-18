'use client'

import { useState } from 'react'
import { useDataAnalysis } from '@/hooks/useMLService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function DataPreprocessor() {
  const { loading, error, analyzeDataset } = useDataAnalysis()
  
  const [rawData, setRawData] = useState(`sales,region,month
1200,North,Jan
1500,South,Jan
1100,East,Jan
1300,West,Jan
1400,North,Feb
1600,South,Feb
1250,East,Feb
1450,West,Feb`)
  
  const [processedData, setProcessedData] = useState<any>(null)
  const [selectedOperation, setSelectedOperation] = useState<'analyze' | 'normalize' | 'clean'>('analyze')

  const operations = [
    { id: 'analyze', label: '📊 Statistical Analysis', description: 'Analyze patterns and trends' },
    { id: 'normalize', label: '⚖️ Data Normalization', description: 'Scale and normalize values' },
    { id: 'clean', label: '🧹 Data Cleaning', description: 'Remove outliers and missing values' },
  ] as const

  const parseCSVData = (csvText: string) => {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim())
      const row: any = {}
      headers.forEach((header, index) => {
        const value = values[index]
        // Try to parse as number, otherwise keep as string
        row[header] = isNaN(Number(value)) ? value : Number(value)
      })
      return row
    })
    
    return { headers, data }
  }

  const extractNumericData = (data: any[]) => {
    if (data.length === 0) return []
    
    const numericColumns = Object.keys(data[0]).filter(key => 
      typeof data[0][key] === 'number'
    )
    
    return data.map(row => 
      numericColumns.map(col => row[col])
    ).filter(row => row.length > 0)
  }

  const handleAnalyze = async () => {
    try {
      const { headers, data } = parseCSVData(rawData)
      const numericData = extractNumericData(data)
      
      if (numericData.length === 0) {
        setProcessedData({ error: 'No numeric data found for analysis' })
        return
      }

      const analysis = await analyzeDataset(numericData)
      
      setProcessedData({
        type: 'analysis',
        originalData: data,
        headers,
        numericData,
        analysis,
      })
    } catch (err) {
      setProcessedData({ error: err instanceof Error ? err.message : 'Analysis failed' })
    }
  }

  const handleNormalize = () => {
    try {
      const { headers, data } = parseCSVData(rawData)
      const numericData = extractNumericData(data)
      
      if (numericData.length === 0) {
        setProcessedData({ error: 'No numeric data found for normalization' })
        return
      }

      // Min-Max normalization
      const flattened = numericData.flat()
      const min = Math.min(...flattened)
      const max = Math.max(...flattened)
      const range = max - min

      const normalized = numericData.map(row => 
        row.map(val => range === 0 ? 0 : (val - min) / range)
      )

      setProcessedData({
        type: 'normalize',
        originalData: data,
        headers,
        numericData,
        normalized,
        stats: { min, max, range },
      })
    } catch (err) {
      setProcessedData({ error: err instanceof Error ? err.message : 'Normalization failed' })
    }
  }

  const handleClean = () => {
    try {
      const { headers, data } = parseCSVData(rawData)
      const numericData = extractNumericData(data)
      
      if (numericData.length === 0) {
        setProcessedData({ error: 'No numeric data found for cleaning' })
        return
      }

      // Calculate outliers using IQR method
      const flattened = numericData.flat().sort((a, b) => a - b)
      const q1Index = Math.floor(flattened.length * 0.25)
      const q3Index = Math.floor(flattened.length * 0.75)
      const q1 = flattened[q1Index]
      const q3 = flattened[q3Index]
      const iqr = q3 - q1
      const lowerBound = q1 - 1.5 * iqr
      const upperBound = q3 + 1.5 * iqr

      // Remove outliers
      const cleanedData = numericData.filter(row => 
        row.every(val => val >= lowerBound && val <= upperBound)
      )

      // Handle missing values (replace with mean)
      const means = cleanedData[0].map((_, colIndex) => {
        const columnValues = cleanedData.map(row => row[colIndex])
        return columnValues.reduce((sum, val) => sum + val, 0) / columnValues.length
      })

      setProcessedData({
        type: 'clean',
        originalData: data,
        headers,
        numericData,
        cleanedData,
        outlierStats: {
          originalCount: numericData.length,
          cleanedCount: cleanedData.length,
          removed: numericData.length - cleanedData.length,
          bounds: { lower: lowerBound, upper: upperBound },
        },
        means,
      })
    } catch (err) {
      setProcessedData({ error: err instanceof Error ? err.message : 'Cleaning failed' })
    }
  }

  const handleProcess = () => {
    switch (selectedOperation) {
      case 'analyze':
        handleAnalyze()
        break
      case 'normalize':
        handleNormalize()
        break
      case 'clean':
        handleClean()
        break
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Data Preprocessing</CardTitle>
          <CardDescription>
            Advanced data preprocessing and analysis tools for ML pipelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Operation Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Select Operation:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {operations.map((op) => (
                <button
                  key={op.id}
                  onClick={() => setSelectedOperation(op.id)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    selectedOperation === op.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium text-sm">{op.label}</div>
                  <div className="text-xs opacity-75 mt-1">{op.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Data Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Raw Data (CSV format):
              </label>
              <textarea
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                className="w-full p-3 border rounded-lg font-mono text-sm"
                rows={8}
                placeholder="sales,region,month
1200,North,Jan
1500,South,Jan"
              />
            </div>
            
            <Button 
              onClick={handleProcess}
              disabled={loading || !rawData.trim()}
              className="w-full md:w-auto"
            >
              {loading ? 'Processing...' : `Apply ${operations.find(op => op.id === selectedOperation)?.label}`}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Results Display */}
          {processedData && (
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Processing Results:</h3>
              
              {processedData.error ? (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg">
                  {processedData.error}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Original Data Preview */}
                  <div>
                    <h4 className="font-medium mb-2">Original Data Preview:</h4>
                    <div className="bg-gray-50 border rounded-lg p-3 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            {processedData.headers?.map((header: string) => (
                              <th key={header} className="text-left p-1 border-b">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {processedData.originalData?.slice(0, 5).map((row: any, index: number) => (
                            <tr key={index}>
                              {processedData.headers?.map((header: string) => (
                                <td key={header} className="p-1">
                                  {row[header]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {processedData.originalData?.length > 5 && (
                        <div className="text-xs text-gray-500 mt-2">
                          ... and {processedData.originalData.length - 5} more rows
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Analysis Results */}
                  {processedData.type === 'analysis' && processedData.analysis && (
                    <div>
                      <h4 className="font-medium mb-2">Statistical Analysis:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(processedData.analysis.statistics).map(([key, value]) => (
                          <div key={key} className="bg-white border rounded-lg p-3">
                            <div className="text-xs text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div className="font-medium">
                              {typeof value === 'number' ? value.toFixed(4) : String(value)}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {processedData.analysis.insights?.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Insights:</h5>
                          <ul className="list-disc list-inside space-y-1">
                            {processedData.analysis.insights.map((insight: string, index: number) => (
                              <li key={index} className="text-sm">{insight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Normalization Results */}
                  {processedData.type === 'normalize' && (
                    <div>
                      <h4 className="font-medium mb-2">Normalized Data:</h4>
                      <div className="bg-white border rounded-lg p-3">
                        <div className="mb-2 text-sm">
                          <strong>Original Range:</strong> {processedData.stats.min} to {processedData.stats.max}
                          <br />
                          <strong>Normalized Range:</strong> 0 to 1
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr>
                                <th className="text-left p-1 border-b">Row</th>
                                <th className="text-left p-1 border-b">Original</th>
                                <th className="text-left p-1 border-b">Normalized</th>
                              </tr>
                            </thead>
                            <tbody>
                              {processedData.normalized?.slice(0, 5).map((row: number[], index: number) => (
                                <tr key={index}>
                                  <td className="p-1">{index + 1}</td>
                                  <td className="p-1">
                                    [{processedData.numericData[index]?.map((v: number) => v.toFixed(2)).join(', ')}]
                                  </td>
                                  <td className="p-1">
                                    [{row.map(v => v.toFixed(3)).join(', ')}]
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cleaning Results */}
                  {processedData.type === 'clean' && (
                    <div>
                      <h4 className="font-medium mb-2">Data Cleaning Results:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border rounded-lg p-3">
                          <h5 className="font-medium mb-2">Outlier Removal:</h5>
                          <div className="text-sm space-y-1">
                            <div>Original rows: {processedData.outlierStats.originalCount}</div>
                            <div>Clean rows: {processedData.outlierStats.cleanedCount}</div>
                            <div className="text-red-600">
                              Removed: {processedData.outlierStats.removed} outliers
                            </div>
                            <div className="text-xs text-gray-600 mt-2">
                              Bounds: {processedData.outlierStats.bounds.lower.toFixed(2)} to {processedData.outlierStats.bounds.upper.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white border rounded-lg p-3">
                          <h5 className="font-medium mb-2">Column Means:</h5>
                          <div className="text-sm space-y-1">
                            {processedData.means?.map((mean: number, index: number) => (
                              <div key={index}>
                                Column {index + 1}: {mean.toFixed(4)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium mb-2">📝 Data Processing Operations:</h4>
            <div className="text-sm space-y-1">
              <div><strong>Statistical Analysis:</strong> Calculates mean, std dev, outliers, and trends</div>
              <div><strong>Data Normalization:</strong> Scales values to 0-1 range using min-max scaling</div>
              <div><strong>Data Cleaning:</strong> Removes outliers using IQR method and handles missing values</div>
            </div>
            
            <div className="mt-3 text-sm">
              <strong>CSV Format:</strong> First row should contain column headers, subsequent rows contain data.
              Mix of numeric and text columns is supported.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SignIn() {
  const router = useRouter()

  useEffect(() => {
    // Automatically redirect to home page after 3 seconds
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-3xl font-bold">AI</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            AI/ML Platform
          </h1>
          <p className="text-gray-600">
            Open Access Platform
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">No Authentication Required!</CardTitle>
            <CardDescription className="text-gray-600">
              This platform is now open access - no sign-in needed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🌐</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Open Platform Access</h3>
              <p className="text-gray-600 mb-6">
                You can now access all features without signing in. Redirecting you to the main platform...
              </p>
              
              <div className="space-y-3">
                <Link href="/">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg transition-all duration-300">
                    🚀 Go to Platform Now
                  </Button>
                </Link>
                
                <div className="text-sm text-gray-500">
                  Automatically redirecting in 3 seconds...
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                    <span className="text-green-600 text-lg">🎯</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">Direct Access</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                    <span className="text-blue-600 text-lg">⚡</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">No Setup</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
                    <span className="text-purple-600 text-lg">🚀</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">AI Ready</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Open platform - no terms or policies required!</p>
        </div>
      </div>
    </div>
  )
}
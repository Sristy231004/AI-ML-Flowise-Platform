'use client'

import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  // No authentication provider needed for open access
  return (
    <>
      {children}
    </>
  )
}
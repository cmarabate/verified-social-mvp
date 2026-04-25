import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Verify Identity | VerifiedSocial',
  robots: {
    index: false,
    follow: false,
  },
}

export default function VerifyLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}

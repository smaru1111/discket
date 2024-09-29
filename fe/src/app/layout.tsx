'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/provider/AuthProvider'
import { AzureConfigComponent } from '@/utils/auth/AzureConfigComponent'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AzureConfigComponent>
          <AuthProvider>{children}</AuthProvider>
        </AzureConfigComponent>
      </body>
    </html>
  )
}

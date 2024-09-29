'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/provider/AuthProvider'
import { AzureConfigComponent } from '@/utils/auth/AzureConfigComponent'
import { SnackbarProvider } from 'notistack'

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
          <AuthProvider>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              {children}
            </SnackbarProvider>
          </AuthProvider>
        </AzureConfigComponent>
      </body>
    </html>
  )
}

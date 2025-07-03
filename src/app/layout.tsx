import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CssBaseline } from '@mui/material'
import ThemeRegistry from '@/app/ThemeRegistry';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Salvaterus Web',
  description: 'Gestione familiare con scadenze e attività',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={inter.className}>
          <CssBaseline />
          <ThemeRegistry>
          <main>{children}</main>
          </ThemeRegistry>
      </body>
    </html>
  )
}

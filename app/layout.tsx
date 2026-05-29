import type { Metadata } from 'next'
import { Inter, Noto_Sans_TC } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '300', '400'],
  display: 'swap',
  variable: '--font-app-sans',
})

const notoTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['300', '400'],
  display: 'swap',
  variable: '--font-app-zh',
})

export const metadata: Metadata = {
  title: '社團資訊彙整｜臺北市數位實驗高中學生自治會',
  description: '探索數位實驗高中各社團資訊、章程、社群媒體與幹部名單',
  generator: 'v0.app',
  icons: {
    icon: 'https://tschool-students.github.io/favicon.ico',
    apple: 'https://tschool-students.github.io/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW" className={`${inter.variable} ${notoTC.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

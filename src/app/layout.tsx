import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Swarasync - You cultivate it—and it quietly cultivates you.',
  description: 'A majestic PWA rhythm game grounded in Shiva Swarodaya. Calm, tap-and-breath experience combining ancient wisdom with modern design.',
  keywords: ['meditation', 'breath', 'swara', 'mindfulness', 'rhythm game', 'wellness'],
  authors: [{ name: 'Swarasync' }],
  creator: 'Swarasync',
  publisher: 'Swarasync',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/app-icon-192.png',
    apple: '/icons/app-icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Swarasync',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  themeColor: '#A78BFA',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-moon-100 via-central-100 to-sun-100">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}

import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { PT_Sans } from 'next/font/google'
import { SpeedInsights } from "@vercel/speed-insights/next"

const ptSans = PT_Sans({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'OrderFlow Lite',
  description: 'A modern, minimal order-taking app for shift-based environments.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'OrderFlow Lite',
    startupImage: [
      { url: '/splash-dark.png', media: '(prefers-color-scheme: dark)' },
      { url: '/splash-light.png', media: '(prefers-color-scheme: light)' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ptSans.variable} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#F9FAFB" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#18181b" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="font-sans antialiased overflow-hidden">
        {children}
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}

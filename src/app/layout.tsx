import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { PT_Sans } from 'next/font/google'

const ptSans = PT_Sans({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'OrderFlow Lite',
  description: 'A modern, minimal order-taking app for shift-based environments.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'OrderFlow Lite',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ptSans.variable}>
      <head>
        <meta name="theme-color" content="#FAFAFA" />
      </head>
      <body className="font-sans antialiased overflow-hidden">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

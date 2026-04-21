import type { Metadata } from "next"
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css"

export const metadata: Metadata = {
  title: "Brainwave - AI Website Builder",
  description: "Generate professional websites from zero to one with AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-background font-sans antialiased text-foreground">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}


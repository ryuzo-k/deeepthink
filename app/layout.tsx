import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

export const metadata: Metadata = {
  title: "DeeepThink - Thought Organization Platform",
  description: "Organize your thoughts, ideas, and tasks in a simple, intuitive way",
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "DeeepThink - Thought Organization Platform",
    description: "Organize your thoughts, ideas, and tasks in a simple, intuitive way",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DeeepThink by Kokoro Research",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DeeepThink - Thought Organization Platform",
    description: "Organize your thoughts, ideas, and tasks in a simple, intuitive way",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WA Business Auto Reply Studio",
  description: "Professional WhatsApp Auto Reply Template Generator for small businesses. Create, preview, and manage WhatsApp response templates with ease.",
  keywords: ["WhatsApp", "Auto Reply", "Template Generator", "Business", "Communication"],
  authors: [{ name: "WA Studio Team" }],
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WA Reply Studio",
  },
  other: {
    "mobile-web-app-capable": "true",
    "apple-mobile-web-app-capable": "true",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "WA Reply Studio",
    "application-name": "WA Reply Studio",
    "viewport-fit": "cover",
  },
  openGraph: {
    title: "WA Business Auto Reply Studio",
    description: "Professional WhatsApp Auto Reply Template Generator for small businesses",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

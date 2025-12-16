import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bedtime Stories | Magical Tales for Peaceful Nights",
  description: "Discover enchanting bedtime stories shared by dreamers around the world. Read, share, and drift off to sleep with tales of wonder.",
  keywords: ["bedtime stories", "children stories", "sleep stories", "fairy tales", "night stories"],
  authors: [{ name: "Bedtime Stories" }],
  openGraph: {
    title: "Bedtime Stories | Magical Tales for Peaceful Nights",
    description: "Discover enchanting bedtime stories shared by dreamers around the world.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

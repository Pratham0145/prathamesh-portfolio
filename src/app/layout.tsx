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
  title: "Prathamesh Mahaveer Patil | Data Scientist Portfolio",
  description: "Results-oriented Data Scientist with 3+ years of experience building scalable ML models for customer segmentation, recommendation systems, and conversational AI. Expert in Python, TensorFlow, and RAG Architecture.",
  keywords: ["Data Scientist", "Machine Learning", "AI", "Python", "TensorFlow", "NLP", "Recommendation Systems", "Customer Segmentation", "RAG Architecture", "Deep Learning"],
  authors: [{ name: "Prathamesh Mahaveer Patil" }],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Prathamesh Mahaveer Patil | Data Scientist",
    description: "Building scalable ML models for customer segmentation, recommendation systems, and conversational AI",
    url: "https://prathameshpatil.dev",
    siteName: "Prathamesh Patil Portfolio",
    type: "website",
    images: ["/favicon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prathamesh Mahaveer Patil | Data Scientist",
    description: "Building scalable ML models for customer segmentation, recommendation systems, and conversational AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

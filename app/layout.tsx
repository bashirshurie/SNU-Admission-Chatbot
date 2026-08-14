import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JUS AI Admission Assistant | Jaamacadda Ummadda Soomaaliyeed",
  description:
    "Somali National University (JUS) AI-powered admission assistant for 2026/2027. Get instant answers about admission requirements, colleges, fees, and more in Somali.",
  keywords: [
    "Somali National University",
    "JUS",
    "Jaamacadda Ummadda Soomaaliyeed",
    "admission 2026",
    "AI assistant",
    "diiwaangelinta",
  ],
  authors: [{ name: "Somali National University" }],
  openGraph: {
    title: "JUS AI Admission Assistant",
    description:
      "Ku weydii su'aalaha diiwaangelinta si degdeg ah — Somali National University 2026/2027.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="so"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}

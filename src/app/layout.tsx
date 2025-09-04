import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'GraphAI',
  description: 'An AI-powered Graphviz editor to render DOT code and intelligently refine graph aesthetics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Fira+Code&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <React.Suspense fallback={<div>Loading...</div>}>
          {children}
        </React.Suspense>
        <Toaster />
      </body>
    </html>
  );
}

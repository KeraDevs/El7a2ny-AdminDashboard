"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/tools/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set document title on client side
  useEffect(() => {
    document.title = "El7a2ny Admin Dashboard";
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>El7a2ny Admin Dashboard</title>
        <meta
          name="description"
          content="El7a2ny Admin Dashboard - Manage your platform"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SidebarProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: "var(--background)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                  },
                  success: {
                    style: {
                      borderLeft: "4px solid #10b981",
                    },
                    iconTheme: {
                      primary: "#10b981",
                      secondary: "white",
                    },
                  },
                  error: {
                    style: {
                      borderLeft: "4px solid #ef4444",
                    },
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "white",
                    },
                  },
                  loading: {
                    style: {
                      borderLeft: "4px solid #3b82f6",
                    },
                  },
                }}
              />
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

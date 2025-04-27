"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/tools/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar"; // Don't forget to import it!

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
  return (
    <html lang="en" suppressHydrationWarning>
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
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1">
                  <Navbar />
                  <main className="flex-1 overflow-y-auto p-4">{children}</main>
                </div>
              </div>
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

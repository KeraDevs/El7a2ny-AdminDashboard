import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <h1>Hello</h1>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { FloatingNavbar } from "@/components/ui/FloatingNavbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Credo | Community Trust Platform",
  description: "Build and verify trust through community vouches. The reputation layer for local businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <FloatingNavbar />
            <main className="min-h-screen pt-24 md:pt-28">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

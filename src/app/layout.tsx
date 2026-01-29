import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/app/components"; // Clean import from barrel file

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modular Component App",
  description: "Built with reusable architecture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
} 
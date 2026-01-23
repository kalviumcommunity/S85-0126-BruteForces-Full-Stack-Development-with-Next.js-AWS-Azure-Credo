import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Nesting providers makes their state available to all children */}
        <AuthProvider>
          <UIProvider>
            {children}
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
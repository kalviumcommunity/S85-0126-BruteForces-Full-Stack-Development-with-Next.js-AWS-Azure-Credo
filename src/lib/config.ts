// src/lib/config.ts

// 1. Server-side validation (checks if .env.local is loaded)
if (!process.env.DATABASE_URL) {
  // If this error throws, it means your .env.local file is missing or empty
  throw new Error("Missing DATABASE_URL in .env.local");
}

export const config = {
  // Safe to use in API Routes & Server Components
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,

  // Safe to use in Client Components (React)
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Enforce strict headers
  async headers() {
    return [
      {
        // Apply these headers to ALL routes
        source: '/:path*',
        headers: [
          // A. HTTPS Enforcement (HSTS)
          // Forces browser to use HTTPS for the next 2 years
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          
          // B. Content Security Policy (CSP)
          // "self" = only allow scripts/styles from our own domain
          // We add 'unsafe-inline' and 'unsafe-eval' because Next.js Dev mode needs them.
          // We add 'grainy-gradients.vercel.app' because your UI uses it for the background.
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://grainy-gradients.vercel.app; font-src 'self';"
          },

          // C. Anti-Clickjacking (X-Frame-Options)
          // Prevents your site from being embedded in an iframe on another site
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          
          // D. Prevent MIME Sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },

          // E. Referrer Policy
          // Only send the origin (domain) when navigating to other sites, not the full URL path
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
      {
        // Apply CORS specifically to API routes
        source: '/api/:path*',
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // In prod, change '*' to your actual domain
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ];
  },
};

export default nextConfig;
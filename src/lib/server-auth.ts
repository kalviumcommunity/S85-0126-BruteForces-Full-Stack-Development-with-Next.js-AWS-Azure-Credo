import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/db';

/**
 * Server-side helper to get the authenticated user.
 * Tries to parse Supabase session from cookies.
 */
export async function getAuthenticatedUser() {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  
  // Find the Supabase auth cookie (usually sb-<project-ref>-auth-token)
  const authCookie = allCookies.find(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));

  if (!authCookie) {
    return null;
  }

  try {
    // Parse the cookie value
    // Supabase v2 cookies are often base64 or JSON strings. 
    // Usually formatted as ["access_token", "refresh_token"] or similar JSON structure.
    // If we can't easily parse it without the SSR library, we might try to just verify existence 
    // BUT we need the User ID.
    
    // Better approach without @supabase/ssr:
    // Create a client and set the session manually if we can get the access_token.
    // The cookie value typically contains the session data.
    
    // Let's assume standard JSON format if possible, otherwise we rely on 'getUser' 
    // call if we initialize client with global headers (which isn't easy here).
    
    // BACKUP STRATEGY: 
    // If the user hasn't installed @supabase/ssr, we strongly recommend it.
    // However, to make this code "work" potentially without it:
    
    const sessionData = JSON.parse(decodeURIComponent(authCookie.value));
    // Depending on version, it might be structured differently. 
    // Let's try to extract access_token.
    const accessToken = sessionData.access_token || sessionData[0]; // v1 was array
    
    if (!accessToken) return null;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
          global: {
              headers: {
                  Authorization: `Bearer ${accessToken}`
              }
          }
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    return user;

  } catch (error) {
    console.error("Auth helper error:", error);
    return null;
  }
}

/**
 * Gets the Prisma Profile for the current authenticated user.
 */
export async function getCurrentBusinessProfile() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const profile = await prisma.profile.findUnique({
    where: { id: user.id }
  });

  return profile;
}

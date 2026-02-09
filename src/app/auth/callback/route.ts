import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Using exchangeCodeForSession if checking on server side, 
    // but typically with implicit flow or pkce, the client handles it.
    // However, if using magic link, we exchange code here.
    
    // Note: This basic client might not persist cookies for Server Components automatically 
    // without @supabase/ssr or middleware handling. 
    // For this scaffold, we assume client-side session handling or middleware will handle tokens.
    // But verifyExchange is needed.
    
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', request.url))
}

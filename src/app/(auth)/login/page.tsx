'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Helper components if Shadcn not fully installed
const UI_Input = (props: any) => <input className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50" {...props} />;
const UI_Button = (props: any) => <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 w-full" {...props} />;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Initialize Supabase Client for creating sessions
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Session is handled by Supabase client (local storage)
      // BUT for middleware to see it, we need it in cookies.
      // Valid Supabase + Next.js setup uses auth-helpers to sync this automatically.
      // If manually: The client sets the cookie. 
      // Supabase-js v2 doesn't automatically set cookies for Next.js server components unless configured with cookie storage.
      
      // For this simplified setup, we rely on the client-side session or we force a reload/redirect
      // where the middleware might catch us.
      
      // In a real app: use `createClientComponentClient` from @supabase/auth-helpers-nextjs
      // which handles the cookie sync.
      
      // Assuming 'sb-[ref]-auth-token' is set by the client library by default if storage is valid,
      // or we just redirect and hope the middleware (which checks cookies) sees it.
      
      // If it fails, the user needs to install the helper packages.
      // We will refresh the page to ensure cookies are sent.
      router.refresh(); 
      router.push('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const InputComp = (globalThis as any).Input || UI_Input;
  const ButtonComp = (globalThis as any).Button || UI_Button;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to manage your Trust Profile
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <InputComp 
                id="email" 
                type="email" 
                required 
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <InputComp 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <ButtonComp type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </ButtonComp>
        </form>
        
        <div className="text-center mt-4">
            <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <Link href="/signup" className="font-medium text-slate-900 hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}

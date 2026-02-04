'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Input = ({ icon: Icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ElementType }) => (
  <div className="relative group">
    {Icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
        <Icon size={18} />
      </div>
    )}
    <input
      {...props}
      className={`w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm ${
        Icon ? 'pl-10' : ''
      } ${props.className || ''}`}
    />
  </div>
);

const Button = ({ children, isLoading, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean }) => (
  <button
    disabled={isLoading || props.disabled}
    className={`w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 ${className}`}
    {...props}
  >
    {isLoading && <Loader2 size={18} className="animate-spin" />}
    <span>{children}</span>
  </button>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const signedUp = searchParams.get('signedUp');

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

      if (error) throw error;
      if (!data.session) throw new Error("No session created");

      const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL!.match(/https:\/\/(.*)\.supabase\.co/)?.[1] || "";
      if (projectRef) {
          const cookieName = `sb-${projectRef}-auth-token`;
           document.cookie = `${cookieName}=true; path=/; max-age=${data.session.expires_in}; SameSite=Lax; Secure`;
      }

      router.refresh();
      router.push('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-600/20">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Credo</h1>
        <p className="text-slate-500 text-sm mt-1">Trust, verified.</p>
      </div>

      <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-2 text-sm">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          {signedUp && (
             <div className="mb-6 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>Account created! Please log in.</span>
             </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Email</label>
                <Input 
                  icon={Mail}
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                <Input 
                  icon={Lock}
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  required 
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" isLoading={loading}>
                Sign In <ArrowRight size={18} className="ml-1 opacity-80" />
              </Button>
            </div>
          </form>
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Don''t have an account?{' '}
            <Link href="/signup" className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
              Create a Business Profile
            </Link>
          </p>
        </div>
      </Card>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-400">
          &copy; 2026 Credo Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}

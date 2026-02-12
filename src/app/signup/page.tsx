'use client'

import React, { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
            full_name: fullName,
        },
        emailRedirectTo: `${location.origin}/auth/callback`,
      }
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
    } else {
      setMessage('Account created! Please check your email to confirm.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
             <ShieldCheck size={28} />
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-foreground">
            Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-card px-6 py-8 shadow-sm ring-1 ring-border sm:rounded-xl">
            <form className="space-y-6" onSubmit={handleSignup}>
            <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-foreground">
                Full Name
                </label>
                <div className="mt-2">
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full rounded-md border-0 py-2.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-foreground">
                Email address
                </label>
                <div className="mt-2">
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-2.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-foreground">
                Password
                </label>
                <div className="mt-2">
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-2.5 bg-background text-foreground shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
                </div>
            </div>

            <div>
                <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-primary px-3 py-2.5 text-sm font-semibold leading-6 text-primary-foreground shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 disabled:cursor-not-allowed"
                >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {loading ? 'Creating Account...' : 'Sign up'}
                </button>
            </div>
            </form>

            {message && (
                <div className={`mt-4 rounded-md p-3 text-sm font-medium text-center ${message.includes('created') ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-destructive/10 text-destructive'}`}>
                    {message}
                </div>
            )}
        </div>
        
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Already a member?{' '}
          <Link href="/login" className="font-semibold leading-6 text-primary hover:text-primary/80">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

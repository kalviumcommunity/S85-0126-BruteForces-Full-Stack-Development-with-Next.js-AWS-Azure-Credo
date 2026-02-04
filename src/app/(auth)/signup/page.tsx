'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { signUpBusiness } from '@/actions/auth';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Building2, Globe } from 'lucide-react';

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Input = ({ icon: Icon, rightElement, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ElementType, rightElement?: React.ReactNode }) => (
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
    {rightElement && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {rightElement}
      </div>
    )}
  </div>
);

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
    >
      {pending && <Loader2 size={18} className="animate-spin" />}
      <span>{pending ? 'Creating Profile...' : 'Create Account'}</span>
      {!pending && <ArrowRight size={18} className="ml-1 opacity-80" />}
    </button>
  );
}

const SignupPage = () => {
    // @ts-ignore
    const [state, dispatch] = useFormState(signUpBusiness, {});

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/50 flex flex-col items-center justify-center p-4">
             <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-600/20">
                <ShieldCheck className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Join Credo</h1>
                <p className="text-slate-500 text-sm mt-1">Start your trust journey today.</p>
            </div>

            <Card className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-500">
                <div className="p-8">
                    <form action={dispatch} className="space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Business Name</label>
                                <Input 
                                    icon={Building2}
                                    id="businessName" 
                                    name="businessName" 
                                    placeholder="Acme Inc." 
                                    required 
                                />
                                {state.errors?.businessName && <p className="text-xs text-red-500 mt-1 ml-1">{state.errors.businessName[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Unique Handle</label>
                                <div className="flex items-center">
                                    <div className="bg-slate-100 border border-slate-200 border-r-0 rounded-l-lg py-3 px-3 text-sm text-slate-500 font-medium select-none">
                                        credo.app/p/
                                    </div>
                                    <input 
                                        id="slug" 
                                        name="slug" 
                                        placeholder="acme-inc" 
                                        required 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-r-lg border-l-0 py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 text-sm"
                                    />
                                </div>
                                {state.errors?.slug && <p className="text-xs text-red-500 mt-1 ml-1">{state.errors.slug[0]}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Email</label>
                                    <Input 
                                        icon={Mail}
                                        id="email" 
                                        name="email" 
                                        type="email" 
                                        placeholder="you@company.com" 
                                        required 
                                    />
                                     {state.errors?.email && <p className="text-xs text-red-500 mt-1 ml-1">{state.errors.email[0]}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                                    <Input 
                                        icon={Lock}
                                        id="password" 
                                        name="password" 
                                        type="password" 
                                        placeholder=""
                                        required 
                                    />
                                     {state.errors?.password && <p className="text-xs text-red-500 mt-1 ml-1">{state.errors.password[0]}</p>}
                                </div>
                            </div>
                        </div>

                        {state.message && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 animate-in slide-in-from-top-2 flex items-center">
                                <span className="mr-2"></span> {state.message}
                            </div>
                        )}

                        <div className="pt-2">
                             <SubmitButton />
                        </div>
                    </form>
                </div>

                <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                    <p className="text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
                            Log in
                        </Link>
                    </p>
                </div>
            </Card>

             <div className="mt-8 text-center max-w-sm">
                <p className="text-xs text-slate-400">
                    By clicking "Create Account", you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default SignupPage;

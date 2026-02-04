'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { signUpBusiness } from '@/actions/auth';
import { Input } from '@/components/ui/input'; // Assuming existence
import { Button } from '@/components/ui/button'; // Assuming existence
import { Label } from '@/components/ui/label';   // Assuming existence
import Link from 'next/link';

// Fallback components if shadcn/ui is not fully present in the scaffold
const UI_Input = (props: any) => <input className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50" {...props} />;
const UI_Button = (props: any) => <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 w-full" {...props} />;
const UI_Label = (props: any) => <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" {...props} />;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Creating Account...' : 'Create Business Profile'}
    </Button>
  );
}

const SignupPage = () => {
    // @ts-ignore - useFormState types can be tricky with Server Actions in some versions
    const [state, dispatch] = useFormState(signUpBusiness, {});

    // Helper to grab the correct component (real or fallback)
    const InputComp = (globalThis as any).Input || UI_Input;
    const ButtonComp = (globalThis as any).Button || UI_Button;
    const LabelComp = (globalThis as any).Label || UI_Label;

    return (
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Join Credo</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Start your trust journey today.
                    </p>
                </div>

                <form action={dispatch} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <LabelComp htmlFor="businessName">Business Name</LabelComp>
                            <InputComp id="businessName" name="businessName" placeholder="Jake's Coffee" required />
                        </div>

                        <div>
                            <LabelComp htmlFor="slug">Profile Handle (URL)</LabelComp>
                            <div className="flex items-center mt-1">
                                <span className="text-slate-500 text-sm mr-2">credo.app/p/</span>
                                <InputComp id="slug" name="slug" placeholder="jakes-coffee" required />
                            </div>
                             {state.errors?.slug && (
                                <p className="text-xs text-red-500 mt-1">{state.errors.slug[0]}</p>
                            )}
                        </div>

                        <div>
                            <LabelComp htmlFor="email">Email address</LabelComp>
                            <InputComp id="email" name="email" type="email" placeholder="you@example.com" required />
                        </div>

                        <div>
                            <LabelComp htmlFor="password">Password</LabelComp>
                            <InputComp id="password" name="password" type="password" required />
                        </div>
                    </div>

                    {state.message && (
                        <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
                            {state.message}
                        </div>
                    )}

                    <SubmitButton />
                </form>

                <div className="text-center">
                    <p className="text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-slate-900 hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

'use server';

import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

// Initialize Supabase Client (Ensure you have these env vars)
// Ideally, use @supabase/ssr for cookie handling in server components, 
// but for this Action which might just need API access:
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface SignupState {
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
    businessName?: string[];
    slug?: string[];
  };
}

export async function signUpBusiness(prevState: SignupState, formData: FormData): Promise<SignupState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const businessName = formData.get('businessName') as string;
  let slug = formData.get('slug') as string;

  // 1. Basic Validation
  if (!email || !password || !businessName || !slug) {
    return { message: "All fields are required" };
  }

  // Sanitize slug
  slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  try {
    // 2. Check Uniqueness in DB
    const existingSlug = await prisma.profile.findUnique({ where: { slug } });
    if (existingSlug) {
      return { 
        errors: { 
          slug: ['This handle is already taken. Please choose another.'] 
        } 
      };
    }

    // 3. Create Supabase User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: businessName,
        }
      }
    });

    if (authError) {
      console.error("Supabase Auth Error:", authError);
      if (authError.message.includes('rate limit')) {
        return { message: "Too many attempts. Please wait a moment or check your Supabase Email settings." };
      }
      return { message: authError.message };
    }

    if (!authData.user || !authData.user.id) {
       return { message: "Failed to create user account." };
    }

    // 4. Create Prisma Profile
    // If Using 'Direct URL' in Prisma, this works even in serverless
    await prisma.profile.create({
      data: {
        id: authData.user.id, // Link to Supabase Auth ID
        email: authData.user.email!,
        business_name: businessName,
        slug: slug,
        current_tier: 'BASIC',
        trust_score: 0
      }
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return { message: "An unexpected error occurred. Please try again." };
  }

  // 5. Redirect on Success to Login (Since we can't easily set session cookie on server without @supabase/ssr helpers yet)
  redirect('/login?signedUp=true');
}

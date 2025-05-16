'use server'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function registerUser(email: string, password: string) {
  try {
    console.log('Starting registration process for:', email)

    // Basic validation
    if (!email || !password) {
      return { 
        success: false, 
        error: 'Email and password are required' 
      }
    }

    // Create auth user only - the trigger will handle creating the user record
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    })

    if (signUpError) {
      console.error('Auth signup error:', {
        message: signUpError.message,
        status: signUpError.status,
        code: signUpError.code
      })
      return { 
        success: false, 
        error: 'Failed to create account. Please try again later.' 
      }
    }

    if (!authData?.user?.id) {
      console.error('No user data returned:', authData)
      return { 
        success: false, 
        error: 'Account creation failed. Please try again.' 
      }
    }

    console.log('Auth signup successful, user created:', authData.user.id)

    return { 
      success: true,
      message: 'Please check your email to confirm your account.' 
    }

  } catch (error) {
    console.error('Unexpected registration error:', error)
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again later.' 
    }
  }
} 
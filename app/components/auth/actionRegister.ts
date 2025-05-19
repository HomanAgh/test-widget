'use server'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function registerUser(email: string, password: string, organizationId: number | null = null) {
  try {
    console.log('Starting registration process for:', email, 'with organization:', organizationId)

    // Basic validation
    if (!email || !password) {
      return { 
        success: false, 
        error: 'Email and password are required' 
      }
    }

    // Create auth user first
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          organization_id: organizationId ? organizationId : null // Store organization_id in user metadata
        }
      }
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
    
    // Create or update the user record in public.users table with organization_id
    // This is a fallback in case the database trigger doesn't work
    const userData = {
      id: authData.user.id,
      email: email,
      organization_id: organizationId ? organizationId : null,
      role: 'user' // Default role
      // No timestamp fields as they may be managed by the database
    }
    
    console.log('Inserting user record with data:', userData)
    
    const { data: insertedUser, error: userError } = await supabase
      .from('users')
      .upsert(userData)
      .select()
    
    if (userError) {
      console.error('Error creating user record:', userError)
      // We don't fail the registration if this fails, as the auth trigger should handle it
    } else {
      console.log('User record created successfully:', insertedUser)
    }
    
    // Double-check if the user record was created with the organization
    const { data: checkUser, error: checkError } = await supabase
      .from('users')
      .select('id, email, organization_id')
      .eq('id', authData.user.id)
      .single()
      
    if (checkError) {
      console.error('Error checking user record:', checkError)
    } else {
      console.log('User record check:', checkUser)
    }

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
'use server'

import { createClient } from '@/app/utils/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }
  
  const supabase = await createClient()
  
  try {
    // First authenticate the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    if (!data?.user) {
      return { error: 'Login failed' }
    }

    // Check if the user is approved in the public.users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_approved, role')
      .eq('id', data.user.id)
      .single()

    if (userError) {
      console.error('Error fetching user data:', userError)
      // Sign out the user since there was an error
      await supabase.auth.signOut()
      return { error: 'Error verifying account status. Please try again later.' }
    }

    // If the user is not approved and not an admin, prevent login
    if (!userData?.is_approved && userData?.role !== 'admin') {
      console.log('Unapproved user attempted login:', data.user.email)
      // Sign out the user since they're not approved
      await supabase.auth.signOut()
      return { error: 'Your account has not been approved yet. Please contact an administrator.' }
    }

    // User is authenticated and approved, return success with redirect path
    return { success: true, redirectTo: '/home' }
  } catch (error: any) {
    console.error('Unexpected error during login:', error)
    return { error: 'An unexpected error occurred' }
  }
}
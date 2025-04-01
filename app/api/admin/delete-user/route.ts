'use server'

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase admin client with service role key
// IMPORTANT: Only use service role key in secure server contexts
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required' 
      }, { status: 400 });
    }
    
    console.log('Admin API: Deleting user', userId);
    
    // First try to delete from auth.users
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.error('Admin API: Error deleting auth user:', authError);
      return NextResponse.json({ 
        error: authError.message 
      }, { status: 500 });
    }
    
    // Then try to delete from public.users table if needed
    try {
      const { error: dbError } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (dbError) {
        console.error('Admin API: Error deleting from users table:', dbError);
        // We don't return an error here since the auth user is already deleted
      }
    } catch (dbErr) {
      console.error('Admin API: Exception deleting from users table:', dbErr);
      // We don't return an error here since the auth user is already deleted
    }
    
    console.log('Admin API: User deleted successfully');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin API: Unexpected error:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred' 
    }, { status: 500 });
  }
} 
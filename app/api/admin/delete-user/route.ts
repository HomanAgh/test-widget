'use server'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required' 
      }, { status: 400 });
    }
    
    // Check if environment variables are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Admin API: Missing environment variables for Supabase');
      return NextResponse.json({ 
        error: 'Server configuration error' 
      }, { status: 500 });
    }
    
    // Create Supabase admin client with service role key using createRouteHandlerClient
    const supabaseAdmin = createRouteHandlerClient(
      { cookies },
      {
        supabaseUrl: supabaseUrl,
        supabaseKey: supabaseServiceKey,
      }
    );
    
    // First check if the service role client has been properly initialized
    if (!supabaseAdmin || !supabaseAdmin.auth) {
      throw new Error('Supabase admin client was not initialized correctly');
    }
    
    console.log('Admin API: Deleting user', userId);
    
    // Create a SQL function similar to update_user_role to handle this deletion
    // Use RPC call to delete user from auth and public tables
    const {error} = await supabaseAdmin.rpc('delete_user', {
      p_user_id: userId
    });
    
    if (error) {
      console.error('Admin API: Error deleting user:', error);
      return NextResponse.json({ 
        error: error.message 
      }, { status: 500 });
    }
    
    console.log('Admin API: User deleted successfully');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin API: Unexpected error:', error);
    return NextResponse.json({ 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
} 
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { userId, role } = await request.json();
    
    if (!userId || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    // Create supabase client with service role from environment variables
    const supabaseAdmin = createRouteHandlerClient(
      { cookies },
      {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      }
    );
    
    // First check if the service role client has been properly initialized
    if (!supabaseAdmin || !supabaseAdmin.auth) {
      throw new Error('Supabase admin client was not initialized correctly');
    }
    
    // Update user metadata via RPC function - this is a safer approach
    // You'll need to create this function in your Supabase dashboard
    const { data, error } = await supabaseAdmin.rpc('update_user_role', {
      p_user_id: userId,
      p_role: role
    });

    if (error) {
      console.error('Error updating user role metadata:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Error in update-user-role API:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 
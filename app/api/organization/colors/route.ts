import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_COLORS } from '../../../types/colors';

// GET organization colors
export async function GET(
  request: NextRequest
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  // Verify authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Get organization ID from query params
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get('organizationId');
  
  if (!organizationId) {
    return NextResponse.json(
      { error: 'Organization ID is required' },
      { status: 400 }
    );
  }

  // Get organization colors - no need to check user's organization
  const { data, error } = await supabase
    .from('organization_preferences')
    .select('colors')
    .eq('organization_id', organizationId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organization colors' },
      { status: 500 }
    );
  }

  // Return data or default colors if not found
  return NextResponse.json({
    colors: data?.colors || DEFAULT_COLORS
  });
}

// POST to update organization colors
export async function POST(
  request: NextRequest
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  // Verify authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Check if user is admin
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (userError || userData.role !== 'admin') {
    return NextResponse.json(
      { error: 'Only admins can update organization colors' },
      { status: 403 }
    );
  }

  // Get request body
  const body = await request.json();
  const { organizationId, colors } = body;

  if (!organizationId) {
    return NextResponse.json(
      { error: 'Organization ID is required' },
      { status: 400 }
    );
  }

  if (!colors || typeof colors !== 'object') {
    return NextResponse.json(
      { error: 'Valid colors object is required' },
      { status: 400 }
    );
  }

  // Update organization colors (upsert in case they don't exist yet)
  const { data, error } = await supabase
    .from('organization_preferences')
    .upsert({
      organization_id: organizationId,
      colors,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'organization_id'
    })
    .select();

  if (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update organization colors' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data });
} 
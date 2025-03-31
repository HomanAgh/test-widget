import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateToken, getUserFromToken } from '../../lib/auth';

const prisma = new PrismaClient();

// Simple API to test auth
export async function GET() {
  try {
    // Find the first user in the database
    const firstUser = await prisma.user.findFirst();
    
    if (!firstUser) {
      return NextResponse.json({ error: 'No users found' }, { status: 404 });
    }
    
    // Generate a fresh token
    const token = generateToken(firstUser);
    
    // Test if the token works for verification
    const verifiedUser = await getUserFromToken(token);
    
    return NextResponse.json({
      success: true,
      user: {
        id: firstUser.id,
        email: firstUser.email,
        name: firstUser.name,
      },
      token,
      tokenWorks: !!verifiedUser,
      // Show both JWT_SECRET for debugging (without revealing full value)
      secretFirstChars: process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 3) + '...' : 'undefined',
    });
  } catch (error: unknown) {
    console.error('Auth test error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Auth test failed', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Auth test failed', details: 'Unknown error occurred' }, { status: 500 });
  }
}
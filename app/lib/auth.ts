import { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Enable debugging
const DEBUG = true;

// Generate JWT token
export function generateToken(user: User): string {
  const payload = { uid: user.id.substring(0, 12) };
  if (DEBUG) console.log('Creating token with payload:', payload);
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

// Verify JWT token and get user
export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    if (DEBUG) console.log('JWT_SECRET used:', JWT_SECRET);
    
    // Try to verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { uid: string };
    if (DEBUG) console.log('Token verified successfully, decoded:', decoded);
    
    // Look for users that match the ID prefix
    if (DEBUG) console.log('Looking for users with ID starting with:', decoded.uid);
    const users = await prisma.user.findMany({ 
      where: { 
        id: { startsWith: decoded.uid } 
      } 
    });
    
    if (DEBUG) console.log('Users found:', users.length);
    
    // Return the first matching user
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Compare password with hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate verification token
export function generateVerificationToken(): string {
  return randomBytes(16).toString('hex');
}
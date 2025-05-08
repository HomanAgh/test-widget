/* import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '../../graphql/schema';
import { resolvers } from '../../graphql/resolvers';
import { getUserFromToken } from '../../lib/auth';
import { NextRequest } from 'next/server';

// Enable detailed debugging
const DEBUG = true;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Helper function to safely get header value
function getAuthHeader(headers: any): string {
  try {
    // For Next.js Headers object with get() method
    if (headers && typeof headers.get === 'function') {
      return headers.get('authorization') || '';
    }
    // For standard headers object
    else if (headers && headers.authorization) {
      return headers.authorization as string;
    }
  } catch (e) {
    if (DEBUG) console.error('Header access error:', e);
  }
  return '';
}

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => {
    try {
      // Use helper function to get auth header
      const authHeader = getAuthHeader(req.headers);
      if (DEBUG) console.log('Auth header:', authHeader);
      
      // Extract token if present
      let token = '';
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
        if (DEBUG) console.log('Token length:', token.length);
      } else {
        if (DEBUG) console.log('No Bearer token found in header');
      }
      
      // Get user from token
      const user = token ? await getUserFromToken(token) : null;
      if (DEBUG) console.log('User authenticated:', !!user);
      
      // Return both user and original request
      return { user, req };
    } catch (error) {
      if (DEBUG) console.error('GraphQL context error:', error);
      return { user: null, req };
    }
  },
});

// Export named functions for each HTTP method
export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
} */
import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { 
  generateToken, 
  getUserFromToken, 
  hashPassword, 
  verifyPassword, 
  generateVerificationToken 
} from '../lib/auth';
import { sendVerificationEmail, sendPasswordResetEmail } from '../lib/email';

const prisma = new PrismaClient();

// For troubleshooting
const DEBUG = true;

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: { user: any; req?: any }) => {
      try {
        // Normal auth check
        if (context.user) {
          return context.user;
        }

        // TROUBLESHOOTING: Direct token check for testing
        if (context.req && DEBUG) {
          console.log('Troubleshooting auth directly in resolver');
          
          // Try to get token directly from request headers
          let authHeader;
          if (context.req.headers) {
            if (context.req.headers.get) {
              authHeader = context.req.headers.get('authorization');
            } else {
              authHeader = context.req.headers.authorization;
            }
          }
          
          console.log('Auth header from resolver:', authHeader);
          
          if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            console.log('Token from resolver:', token.substring(0, 15) + '...');
            
            // Try direct user lookup
            const user = await getUserFromToken(token);
            if (user) {
              console.log('User found directly in resolver!');
              return user;
            }
          }
        }
        
        // If we get here, authentication failed
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      } catch (error) {
        console.error('Error in me resolver:', error);
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
    },
  },
  
  Mutation: {
    signup: async (_: any, args: { email: string; password: string; name?: string }) => {
      const { email, password, name } = args;
      
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser) {
        throw new GraphQLError('User with this email already exists', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Generate verification token
      const verificationToken = generateVerificationToken();
      
      // Create user - automatically verify email for testing purposes
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          verificationToken,
          emailVerified: true, // Auto-verify for testing
        },
      });
      
      // Comment out email sending for now
      // try {
      //   await sendVerificationEmail(email, verificationToken);
      // } catch (error) {
      //   console.error('Error sending verification email:', error);
      //   // Continue even if email fails
      // }
      
      // Generate JWT token
      const token = generateToken(user);
      
      return {
        token,
        user,
      };
    },
    
    login: async (_: any, args: { email: string; password: string }) => {
      const { email, password } = args;
      
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });
      
      if (!user) {
        throw new GraphQLError('Invalid email or password', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      
      // Verify password
      const validPassword = await verifyPassword(password, user.password);
      
      if (!validPassword) {
        throw new GraphQLError('Invalid email or password', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      
      // Generate JWT token
      const token = generateToken(user);
      
      return {
        token,
        user,
      };
    },
    
    sendVerificationEmail: async (_: any, args: { email: string }) => {
      const { email } = args;
      
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });
      
      if (!user) {
        // Don't reveal if the user exists or not
        return true;
      }
      
      if (user.emailVerified) {
        return true;
      }
      
      // Generate new verification token
      const verificationToken = generateVerificationToken();
      
      // Update user with new token
      await prisma.user.update({
        where: { id: user.id },
        data: { verificationToken },
      });
      
      // Send verification email
      await sendVerificationEmail(email, verificationToken);
      
      return true;
    },
    
    verifyEmail: async (_: any, args: { token: string }) => {
      const { token } = args;
      
      // Find user with this token
      const user = await prisma.user.findFirst({
        where: { verificationToken: token },
      });
      
      if (!user) {
        throw new GraphQLError('Invalid verification token', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      
      // Mark email as verified
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          verificationToken: null,
        },
      });
      
      return true;
    },
    
    forgotPassword: async (_: any, args: { email: string }) => {
      const { email } = args;
      
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });
      
      if (!user) {
        // Don't reveal if the user exists or not
        return true;
      }
      
      // Generate reset token
      const resetToken = generateVerificationToken();
      
      // Update user with reset token
      await prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordToken: resetToken },
      });
      
      // Send reset email
      await sendPasswordResetEmail(email, resetToken);
      
      return true;
    },
    
    resetPassword: async (_: any, args: { token: string; password: string }) => {
      const { token, password } = args;
      
      // Find user with this token
      const user = await prisma.user.findFirst({
        where: { resetPasswordToken: token },
      });
      
      if (!user) {
        throw new GraphQLError('Invalid reset token', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(password);
      
      // Update user with new password
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
        },
      });
      
      return true;
    },
  },
};
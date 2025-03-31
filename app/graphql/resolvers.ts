import { GraphQLError } from 'graphql';
import { createClient } from '@/app/utils/supabase/server';

// For troubleshooting
const DEBUG = true;

export const resolvers = {
  Query: {
    me: async () => {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (DEBUG) console.log('Current user:', user);

        if (!user) {
          throw new GraphQLError('Not authenticated', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name,
          emailVerified: user.email_confirmed_at ? true : false
        };
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
      const supabase = await createClient();
      
      if (DEBUG) console.log('Signing up user:', email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      if (DEBUG) console.log('Signup successful:', data);

      // Return null token for new signups (email needs verification)
      return {
        token: null, // Token will be null until email is verified
        user: {
          id: data.user?.id,
          email: data.user?.email,
          name: data.user?.user_metadata?.name,
          emailVerified: false // Always false for new signups
        }
      };
    },
    
    login: async (_: any, args: { email: string; password: string }) => {
      const { email, password } = args;
      const supabase = await createClient();
      
      if (DEBUG) console.log('Attempting login for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        // Check if error is due to email not being verified
        if (error.message.includes('Email not confirmed')) {
          throw new GraphQLError('Please verify your email before logging in', {
            extensions: { code: 'UNAUTHORIZED' },
          });
        }
        throw new GraphQLError(error.message, {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      if (!data.session || !data.user) {
        throw new GraphQLError('Login failed', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      if (DEBUG) console.log('Login successful:', data.user.email);

      return {
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name,
          emailVerified: !!data.user.email_confirmed_at
        }
      };
    },
    
    sendVerificationEmail: async (_: any, args: { email: string }) => {
      const supabase = await createClient();
      
      if (DEBUG) console.log('Resending verification email to:', args.email);

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: args.email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`
        }
      });

      if (error) {
        console.error('Error sending verification email:', error);
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      
      return true;
    },
    
    forgotPassword: async (_: any, args: { email: string }) => {
      const supabase = await createClient();
      
      if (DEBUG) console.log('Sending password reset email to:', args.email);

      const { error } = await supabase.auth.resetPasswordForEmail(args.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
      });

      if (error) {
        console.error('Error sending reset email:', error);
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      
      return true;
    },
    
    resetPassword: async (_: any, args: { token: string; password: string }) => {
      const supabase = await createClient();
      
      if (DEBUG) console.log('Resetting password');

      const { error } = await supabase.auth.updateUser({
        password: args.password
      });

      if (error) {
        console.error('Error resetting password:', error);
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      
      return true;
    },
  },
};
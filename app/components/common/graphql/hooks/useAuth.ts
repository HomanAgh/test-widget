/* import { useState, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

// GraphQL queries and mutations
const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!, $name: String) {
    signup(email: $email, password: $password, name: $name) {
      token
      user {
        id
        email
        name
        emailVerified
      }
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        emailVerified
      }
    }
  }
`;

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      emailVerified
    }
  }
`;

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Define mutations
  const [signupMutation] = useMutation(SIGNUP_MUTATION);
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  
  // Fetch current user
  const { loading: queryLoading, refetch } = useQuery(ME_QUERY, {
    skip: typeof window === 'undefined' || !localStorage.getItem('token'),
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
      }
      setLoading(false);
    },
    onError: () => {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    },
  });
  
  // Check for token on first load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
    }
  }, []);
  
  // Signup function
  const signup = async (email: string, password: string, name?: string) => {
    try {
      const { data } = await signupMutation({
        variables: { email, password, name },
      });
      
      localStorage.setItem('token', data.signup.token);
      setUser(data.signup.user);
      return data.signup.user;
    } catch (error) {
      throw error;
    }
  };
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });
      
      localStorage.setItem('token', data.login.token);
      setUser(data.login.user);
      return data.login.user;
    } catch (error) {
      throw error;
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  return {
    user,
    loading: loading || queryLoading,
    signup,
    login,
    logout,
    refetch,
  };
} */
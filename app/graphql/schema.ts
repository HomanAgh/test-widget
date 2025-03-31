import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
    emailVerified: Boolean!
  }

  type AuthPayload {
    token: String     # Removed the ! to make it nullable
    user: User!
  }

  type Query {
    me: User
  }

  type Mutation {
    signup(email: String!, password: String!, name: String): AuthPayload
    login(email: String!, password: String!): AuthPayload
    sendVerificationEmail(email: String!): Boolean
    verifyEmail(token: String!): Boolean
    forgotPassword(email: String!): Boolean
    resetPassword(token: String!, password: String!): Boolean
  }
`;
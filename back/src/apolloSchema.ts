import { gql } from "apollo-server";

export const typeDefs = gql`
  type Message {
    user: String!
    message: String!
    id: ID!
  }

  type Response {
    info: String!
    message: Message!
  }

  type Query {
    getMessages: [Message!]!
    validateJWT(token: String!): String!
  }
  type Mutation {
    register(username: String!, password: String!): String!
    login(username: String!, password: String!): String!
    addMessage(token: String!, message: String!): Response!
    clearChat: String!
    clearUsers: String!
  }
  type Subscription {
    newMessage: Message
  }
`;

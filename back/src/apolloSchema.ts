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
  }
  type Mutation {
    addMessage(user: String!, message: String!): Response!
    clearChat: String!
  }
  type Subscription {
    newMessage: Message
  }
`;

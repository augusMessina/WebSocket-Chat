import { gql } from "apollo-server";

export const typeDefs = gql`
  type Message {
    user: String!
    message: String!
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
  }
  type Subscription {
    newMessage: Message
  }
`;

// type Subscription{
//     matchUpdated(id: String!): Match!
//   }

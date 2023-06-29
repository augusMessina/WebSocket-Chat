import { gql } from "apollo-server";

export const typeDefs = gql`
  type Message {
    id: ID!
    user: String!
    message: String!
    timestamp: Int!
  }

  type Notif {
    modal: String!
    id_passed: String!
    name: String!
  }

  type PublicUser {
    id: String!
    username: String!
  }

  type Chat {
    id: String!
    name: String!
    messages: [Message!]!
    modal: String!
    members: [PublicUser!]!
  }

  type User {
    id: String!
    username: String!
    password: String!
    token: String!
    friendList: [PublicUser!]!
    chats: [Chat!]!
    mailbox: [Notif!]!
  }

  type Response {
    info: String!
    message: Message
    chat: Chat
  }

  type Query {
    getMessages(chatID: String!, msgCount: Int!): [Message!]!
    getUserData(token: String!): User!
    getChatData(chatID: String!): Chat!
    getPublicChats: [Chat!]!
    getFriendlist(token: String!, searchName: String!): [PublicUser!]!
    getUsers: [User!]!
    getChats: [Chat!]!
  }

  type Mutation {
    register(username: String!, password: String!): String!
    login(username: String!, password: String!): String!
    addMessage(
      token: String!
      message: String!
      chatID: String!
      timestamp: Int!
    ): Response!
    createChat(token: String!, name: String!, modal: String!): Response!
    joinChat(token: String!, chatID: String!): String!
    leaveChat(token: String!, chatID: String!): String!
    sendInvitation(
      token: String!
      receiverID: String!
      modal: String!
      chatID: String
    ): String!
    acceptInvitation(token: String!, invitID: String!): String!
    declineInvitation(token: String!, invitID: String!): String!
    readMessages(token: String!, invitID: String!): String!
    removeFriend(token: String!, friendID: String!): String!
    clearMailbox(token: String!): String!

    clearChats: String!
    clearUsers: String!
  }
  type Subscription {
    subChatMessages(token: String!, chatID: String!): Message
    subNotifs(token: String!): Notif
  }
`;

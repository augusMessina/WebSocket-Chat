import { gql } from "apollo-server";

export const typeDefs = gql`
  type Message {
    id: ID!
    user: String!
    message: String!
    timestamp: Float!
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

  type Friend {
    id: String!
    username: String!
    chat: String!
  }

  type Chat {
    id: String!
    name: String!
    messages: [Message!]!
    modal: String!
    members: [PublicUser!]!
  }

  type UserChat {
    id: String!
    name: String!
    modal: String!
    unreadMessages: Int!
  }

  type User {
    id: String!
    username: String!
    password: String!
    token: String!
    friendList: [Friend!]!
    invitSent: [Notif!]!
    chats: [UserChat!]!
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
    getChatData(token: String!, chatID: String!): Chat!
    getPublicChats(searchName: String!): [Chat!]!
    getFriendlist(token: String!, searchName: String!): [PublicUser!]!
    getUsers(searchName: String!): [PublicUser!]!
    getChats: [Chat!]!
  }

  type Mutation {
    register(username: String!, password: String!): String!
    login(username: String!, password: String!): String!
    addMessage(
      token: String!
      message: String!
      chatID: String!
      timestamp: Float!
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
    readMessages(token: String!, chatID: String!): String!
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

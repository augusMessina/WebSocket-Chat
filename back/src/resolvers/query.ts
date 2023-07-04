import { ObjectId } from "mongodb";
import { chatsCollection, usersCollection } from "../db/dbconnection";
import { checkToken } from "../lib/jwt";
import { Chat, PublicUser, Message, User } from "../types";

export const Query = {
  getMessages: async (
    _: unknown,
    params: { chatID: string; msgCount: number }
  ): Promise<Message[]> => {
    try {
      const { chatID, msgCount } = params;
      const chat = await chatsCollection.findOne({ _id: new ObjectId(chatID) });
      if (!chat) {
        throw new Error("invalid chat ID");
      }

      return chat.messages.splice(msgCount * 100, (msgCount + 1) * 100);
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  getUserData: async (_: unknown, params: { token: string }): Promise<User> => {
    try {
      const user = await checkToken(params.token);

      return {
        id: user._id.toString(),
        username: user.username,
        password: user.password,
        token: user.token,
        friendList: user.friendList,
        invitSent: user.invitSent,
        chats: user.chats,
        mailbox: user.mailbox,
      };
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  getChatData: async (
    _: unknown,
    params: { chatID: string }
  ): Promise<Chat> => {
    try {
      const chat = await chatsCollection.findOne({
        _id: new ObjectId(params.chatID),
      });
      if (!chat) {
        throw new Error("invalid chat ID");
      }

      return {
        id: chat._id.toString(),
        name: chat.name,
        messages: chat.messages,
        members: chat.members,
        modal: chat.modal,
      };
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  getPublicChats: async (_: unknown): Promise<Chat[]> => {
    try {
      const publicChats = await chatsCollection
        .find({ modal: "PUBLIC" })
        .toArray();

      return publicChats.map((chat) => ({
        id: chat._id.toString(),
        name: chat.name,
        messages: chat.messages,
        members: chat.members,
        modal: chat.modal,
      }));
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  getFriendlist: async (
    _: unknown,
    params: { token: string; searchName: string }
  ): Promise<PublicUser[]> => {
    try {
      const { token, searchName } = params;

      const user = await checkToken(token);

      const usersFriends = await usersCollection
        .find({
          _id: {
            $in: user.friendList.map((friend) => new ObjectId(friend.id)),
          },
        })
        .toArray();

      return usersFriends
        .filter((user) => user.username.toLowerCase().includes(searchName))
        .map((user) => ({
          id: user._id.toString(),
          username: user.username,
        }));
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  getUsers: async (
    _: unknown,
    params: { searchName: string }
  ): Promise<PublicUser[]> => {
    const users = await usersCollection.find({}).toArray();

    return users
      .filter((user) =>
        user.username.toLowerCase().includes(params.searchName.toLowerCase())
      )
      .map((user) => ({ id: user._id.toString(), username: user.username }));
  },
  getChats: async (_: unknown): Promise<Chat[]> => {
    const chats = await chatsCollection.find({}).toArray();
    return chats.map((chat) => ({
      id: chat._id.toString(),
      name: chat.name,
      messages: chat.messages,
      members: chat.members,
      modal: chat.modal,
    }));
  },
  // validateJWT: async (
  //   _: unknown,
  //   params: { token: string }
  // ): Promise<string> => {
  //   if (await checkToken(params.token)) {
  //     return "valid";
  //   } else {
  //     throw new Error("invalid token");
  //   }
  // },
};

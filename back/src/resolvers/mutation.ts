import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { chatsCollection, usersCollection } from "../db/dbconnection";
import { pubsub } from "../main";
import { Chat, Message, User } from "../types";
import { checkToken, generateToken } from "../lib/jwt";

export const Mutation = {
  register: async (_: unknown, params: User): Promise<string> => {
    const { username, password } = params;
    try {
      const searchUser = await usersCollection.findOne({ username });
      if (searchUser) {
        throw new Error("username already taken");
      }

      const token = await generateToken(username, password);
      const hashPassword = await bcrypt.hash(password, 10);

      await usersCollection.insertOne({
        username,
        password: hashPassword,
        token,
        _id: new ObjectId(),
        chats: [],
        friendList: [],
        mailbox: [],
      });

      return token;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  login: async (_: unknown, params: User): Promise<string> => {
    const { username, password } = params;
    try {
      const user = await usersCollection.findOne({ username });
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = await generateToken(user.username, user.password);
        await usersCollection.updateOne(
          { username: user.username },
          { $set: { token } }
        );
        return token;
      } else {
        throw new Error("invalid credentials");
      }
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  addMessage: async (
    _: unknown,
    params: {
      token: string;
      message: string;
      chatID: string;
      timestamp: string;
    }
  ): Promise<{ info: string; message: Message }> => {
    const { token, message, chatID, timestamp } = params;

    const user = await checkToken(token);

    const chat = await chatsCollection.findOne({ _id: new ObjectId(chatID) });
    if (!chat) {
      throw new Error("chat not found");
    }

    const myNewID = new ObjectId();

    try {
      await chatsCollection.updateOne(
        { _id: chat._id },
        {
          $push: {
            messages: {
              id: myNewID.toString(),
              user: user.username,
              message,
              timestamp,
            },
          },
        }
      );
    } catch (e) {
      throw new Error((e as Error).message);
    }

    pubsub.publish("NEW_MSG", {
      newMessage: { user: user.username, message, id: myNewID, timestamp },
    });

    return {
      info: "message added",
      message: {
        user: user.username,
        message,
        timestamp,
        id: myNewID.toString(),
      },
    };
  },
  createchat: async (
    _: unknown,
    params: { token: string; name: string; modal: string }
  ): Promise<{ info: string; chat: Chat }> => {
    try {
      const { name, modal, token } = params;
      if (
        modal !== "PUBLIC" &&
        modal !== "PRIVATE" &&
        modal !== "FRIEND_CHAT"
      ) {
        throw new Error(
          "invalid chat modality, must be PUBLIC, PRIVATE or FRIEND_CHAT"
        );
      }

      if (
        modal === "PUBLIC" &&
        (await chatsCollection.findOne({ name, modal: "PUBLIC" }))
      ) {
        throw new Error("chat name already taken");
      }

      const user = await checkToken(token);

      const newChat = {
        name,
        modal,
        _id: new ObjectId(),
        messages: [],
        members: [user._id.toString()],
      };

      await chatsCollection.insertOne(newChat);
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $push: { chats: newChat._id.toString() },
        }
      );

      return {
        info: "chat created",
        chat: {
          id: newChat._id.toString(),
          name,
          modal,
          messages: newChat.messages,
          members: newChat.members,
        },
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  joinChat: async (
    _: unknown,
    params: { token: string; chatID: string }
  ): Promise<string> => {
    try {
      const { token, chatID } = params;

      const user = await checkToken(token);

      await chatsCollection.updateOne(
        { _id: new ObjectId(chatID) },
        {
          $push: { members: user._id.toString() },
        }
      );

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $push: { chats: chatID },
        }
      );

      return "joined chat";
    } catch (e) {
      throw new Error(e);
    }
  },
  leaveChat: async (
    _: unknown,
    params: { token: string; chatID: string }
  ): Promise<string> => {
    try {
      const { token, chatID } = params;

      const user = await checkToken(token);

      await chatsCollection.updateOne(
        { _id: new ObjectId(chatID) },
        {
          $pull: { members: user._id.toString() },
        }
      );

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $pull: { chats: chatID },
        }
      );

      return "left chat";
    } catch (e) {
      throw new Error(e);
    }
  },
  sendInvitation: async (
    _: unknown,
    params: {
      token: string;
      receiverID: string;
      modal: string;
      chatID?: string;
    }
  ): Promise<string> => {
    try {
      const { token, receiverID, modal } = params;

      if (modal !== "FRIEND" && modal !== "CHAT") {
        throw new Error("invalid invitation modality, must be FRIEND, CHAT");
      }

      const sender = await checkToken(token);

      const receiver = await usersCollection.findOne({
        _id: new ObjectId(receiverID),
      });

      if (!receiver) {
        throw new Error("invalid receiver ID");
      }

      if (modal === "CHAT") {
        const chat = await chatsCollection.findOne({
          _id: new ObjectId(params.chatID),
        });
        if (!chat) {
          throw new Error("invalid chat ID");
        }
        await usersCollection.updateOne(
          { _id: receiver._id },
          {
            $push: {
              mailbox: {
                modal,
                id_sender: sender._id.toString(),
                name: chat.name,
              },
            },
          }
        );
      } else {
      }
    } catch (e) {
      throw new Error(e);
    }
  },
  clearChat: async (_: unknown): Promise<string> => {
    try {
      await chatsCollection.deleteMany({});
    } catch (e) {
      throw new Error((e as Error).message);
    }
    return "All messages cleared.";
  },
  clearUsers: async (_: unknown): Promise<string> => {
    try {
      await usersCollection.deleteMany({});
    } catch (e) {
      throw new Error((e as Error).message);
    }
    return "All users cleared.";
  },
};

import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { messagesCollection, usersCollection } from "../db/dbconnection";
import { pubsub } from "../main";
import { Message, User } from "../types";
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
    params: { token: string; message: string }
  ): Promise<{ info: string; message: Message & { id: string } }> => {
    const { token, message } = params;

    const username = await checkToken(token);
    if (!username) {
      throw new Error("invalid token");
    }

    const myNewID = new ObjectId();

    try {
      await messagesCollection.insertOne({
        user: username,
        message,
        _id: myNewID,
      });
    } catch (e) {
      throw new Error((e as Error).message);
    }

    pubsub.publish("NEW_MSG", {
      newMessage: { user: username, message: params.message, id: myNewID },
    });

    return {
      info: "message added",
      message: {
        user: username,
        message,
        id: myNewID.toString(),
      },
    };
  },
  clearChat: async (_: unknown): Promise<string> => {
    try {
      await messagesCollection.deleteMany({});
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

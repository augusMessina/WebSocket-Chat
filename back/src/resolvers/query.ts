import { messagesCollection, usersCollection } from "../db/dbconnection";
import { checkToken } from "../lib/jwt";
import { Message, User } from "../types";

export const Query = {
  getMessages: async (_: unknown): Promise<(Message & { id: string })[]> => {
    try {
      const messages = await messagesCollection.find({}).toArray();
      return messages.map((message) => ({
        user: message.user,
        message: message.message,
        id: message._id.toString(),
      }));
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  validateJWT: async (
    _: unknown,
    params: { token: string }
  ): Promise<string> => {
    if (await checkToken(params.token)) {
      return "valid";
    } else {
      throw new Error("invalid token");
    }
  },
};

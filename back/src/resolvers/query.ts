import { messagesCollection, usersCollection } from "../db/dbconnection";
import { Message, User } from "../types";

export const Query = {
  getMessages: async (_: unknown): Promise<(Message & { id: string })[]> => {
    try {
      const messages = await messagesCollection.find({}).toArray();
      console.log(messages);
      return messages.map((message) => ({
        user: message.user,
        message: message.message,
        id: message._id.toString(),
      }));
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
};

import { messagesCollection } from "../db/dbconnection";
import { Message } from "../types";

export const Query = {
  getMessages: async (_: unknown): Promise<(Message & { id: string })[]> => {
    const messages = await messagesCollection.find({}).toArray();

    return messages.map((message) => ({
      user: message.user,
      message: message.message,
      id: message._id.toString(),
    }));
  },
};

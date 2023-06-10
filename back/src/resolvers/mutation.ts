import { ObjectId } from "mongodb";
import { messagesCollection } from "../db/dbconnection";
import { pubsub } from "../main";
import { Message } from "../types";

export const Mutation = {
  addMessage: async (
    _: unknown,
    params: { user: string; message: string }
  ): Promise<{ info: string; message: Message & { id: string } }> => {
    const { user, message } = params;

    const myNewID = new ObjectId();

    await messagesCollection.insertOne({
      user,
      message,
      _id: myNewID,
    });

    pubsub.publish("NEW_MSG", {
      newMessage: { user: params.user, message: params.message },
    });

    return {
      info: "message added",
      message: {
        user,
        message,
        id: myNewID.toString(),
      },
    };
  },
  clearChat: async (_: unknown): Promise<string> => {
    await messagesCollection.deleteMany({});
    return "All messages cleared.";
  },
};

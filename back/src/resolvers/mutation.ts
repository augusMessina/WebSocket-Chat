// import { InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { messages } from "../db/dbconnection";
import { pubsub } from "../main";
import { Message } from "../types";
// import { MatchSchema } from "../db/schema";
// import { Match } from "../types";
// import { pubsub } from "../main";

export const Mutation = {
  addMessage: (
    _: unknown,
    params: { user: string; message: string }
  ): { info: string; message: Message } => {
    const newMessage: Message = { user: params.user, message: params.message };

    messages.push(newMessage);

    pubsub.publish("NEW_MSG", {
      newMessage: { user: params.user, message: params.message },
    });

    return {
      info: "message added",
      message: newMessage,
    };
  },
};

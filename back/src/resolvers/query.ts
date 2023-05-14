import { messages } from "../db/dbconnection";
// import { ObjectId } from "mongodb";
import { Message } from "../types";
// import { MatchSchema } from "../db/schema";

export const Query = {
  getMessages: (_: unknown): Message[] => {
    return messages;
  },
};

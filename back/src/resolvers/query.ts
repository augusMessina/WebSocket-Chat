import { messages } from "../db/dbconnection";
import { Message } from "../types";

export const Query = {
  getMessages: (_: unknown): Message[] => {
    return messages;
  },
};

import { Message } from "../types.ts";
import { ObjectId } from "mongodb";

export type MessageSchema = Message & {
  _id: ObjectId;
};

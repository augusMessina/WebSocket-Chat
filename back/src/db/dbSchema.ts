import { Message, User } from "../types";
import { ObjectId } from "mongodb";

export type MessageSchema = Message & {
  _id: ObjectId;
};

export type UserSchema = User & {
  _id: ObjectId;
};

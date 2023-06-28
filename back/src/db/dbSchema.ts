import { Chat, User } from "../types";
import { ObjectId } from "mongodb";

export type UserSchema = Omit<User, "id"> & {
  _id: ObjectId;
};

export type ChatSchema = Omit<Chat, "id"> & {
  _id: ObjectId;
};

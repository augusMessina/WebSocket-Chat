import { MongoClient } from "mongodb";
import { ChatSchema, UserSchema } from "./dbSchema";

const client = new MongoClient("mongodb://mongo:27017");

const dbConnect = async () => {
  await client.connect();
  console.log("DB CONNECTED");
};

dbConnect();
export const db = client.db("ChatDB");
export const chatsCollection = db.collection<ChatSchema>("Chats");
export const usersCollection = db.collection<UserSchema>("Users");

import { MongoClient } from "mongodb";
import { MessageSchema, UserSchema } from "./dbSchema";

const client = new MongoClient("mongodb://mongo:27017");

const dbConnect = async () => {
  await client.connect();
  console.log("DB CONNECTED");
};

dbConnect();
export const db = client.db("ChatDB");
export const messagesCollection = db.collection<MessageSchema>("Messages");
export const usersCollection = db.collection<UserSchema>("Users");

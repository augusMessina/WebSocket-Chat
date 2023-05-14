// import { MatchSchema } from "./schema";
// import {
//   MongoClient
// } from "mongodb";
// import { config } from "dotenv";

import { Message } from "../types";

// config();

// const uri: string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PSWRD}@${process.env.DB_URL}/?authMechanism=SCRAM-SHA-1`;

// const client = new MongoClient(uri)
// //usuario: Augus, password: NebrijaAugus
// const dbConnect = async() => {
//   await client.connect();
// };

// dbConnect();

// export const db = client.db("Cluster0");

// export const matchesCollection = db.collection<MatchSchema>("MatchesSuscripciones");
export const messages: Message[] = [];

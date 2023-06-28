import jwt from "jsonwebtoken";
import { usersCollection } from "../db/dbconnection";

export const generateToken = (username: string, password: string) => {
  return jwt.sign(
    {
      username,
      password,
    },
    "MY-SECRET-KEY"
  );
};

export const checkToken = async (token: string) => {
  const user = await usersCollection.findOne({ token });
  if (!user) {
    throw new Error("invalid token");
  }
  return user;
};

import { ObjectId } from "mongodb";

export type Message = {
  id: string;
  user: string;
  message: string;
  timestamp: number;
};

export type Notif = {
  modal: string;
  id_passed: string;
  name: string;
};

export type PublicUser = {
  id: string;
  username: string;
};

export type User = {
  id: string;
  username: string;
  password: string;
  token: string;
  friendList: PublicUser[];
  chats: string[];
  mailbox: Notif[];
};

export type Chat = {
  id: string;
  name: string;
  messages: Message[];
  modal: string;
  members: PublicUser[];
};

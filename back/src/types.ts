import { ObjectId } from "mongodb";

export type Message = {
  id: string;
  user: string;
  message: string;
  timestamp: string;
};

export type Notif = {
  modal: string;
  id_passed: string;
  name: string;
};

export type Friend = {
  id: string;
  username: string;
};

export type User = {
  id: string;
  username: string;
  password: string;
  token: string;
  friendList: Friend[];
  chats: string[];
  mailbox: Notif[];
};

export type Chat = {
  id: string;
  name: string;
  messages: Message[];
  modal: string;
  members: string[];
};

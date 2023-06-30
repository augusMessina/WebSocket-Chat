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

export type Friend = PublicUser & { chat: string };

export type SimpleChat = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  username: string;
  password: string;
  token: string;
  friendList: Friend[];
  chats: SimpleChat[];
  mailbox: Notif[];
};

export type Chat = {
  id: string;
  name: string;
  messages: Message[];
  modal: string;
  members: PublicUser[];
};

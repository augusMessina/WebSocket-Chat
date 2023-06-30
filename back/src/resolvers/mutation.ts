import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { chatsCollection, usersCollection } from "../db/dbconnection";
import { pubsub } from "../main";
import { Chat, Message, PublicUser, User } from "../types";
import { checkToken, generateToken } from "../lib/jwt";
import { ChatSchema } from "../db/dbSchema";

export const Mutation = {
  // parmas: username and password.
  // function: generate user document
  // returns: JWT
  register: async (_: unknown, params: User): Promise<string> => {
    const { username, password } = params;
    try {
      const searchUser = await usersCollection.findOne({
        username: username.toLowerCase(),
      });
      if (searchUser) {
        throw new Error("username already taken");
      }

      const token = await generateToken(username, password);
      const hashPassword = await bcrypt.hash(password, 10);

      await usersCollection.insertOne({
        username: username.toLowerCase(),
        password: hashPassword,
        token,
        _id: new ObjectId(),
        chats: [],
        friendList: [],
        mailbox: [],
      });

      return token;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  // parmas: username and password.
  // function: validate credentials and update JWT
  // returns: JWT
  login: async (_: unknown, params: User): Promise<string> => {
    const { username, password } = params;
    try {
      const user = await usersCollection.findOne({
        username: username.toLowerCase(),
      });
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = await generateToken(user.username, user.password);
        await usersCollection.updateOne(
          { username: user.username },
          { $set: { token } }
        );
        return token;
      } else {
        throw new Error("invalid credentials");
      }
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  // parmas: user JWT, message sended, ID of chet, timestamp.
  // function: pushes a new message into the messages property of chat
  // returns: info and message
  addMessage: async (
    _: unknown,
    params: {
      token: string;
      message: string;
      chatID: string;
      timestamp: number;
    }
  ): Promise<{ info: string; message: Message }> => {
    const { token, message, chatID, timestamp } = params;

    const user = await checkToken(token);

    const chat = await chatsCollection.findOne({ _id: new ObjectId(chatID) });
    if (!chat) {
      throw new Error("chat not found");
    }

    const myNewID = new ObjectId();

    try {
      await chatsCollection.updateOne(
        { _id: chat._id },
        {
          $push: {
            messages: {
              id: myNewID.toString(),
              user: user.username,
              message: message.trim(),
              timestamp,
            },
          },
        }
      );

      // puts the most recent chat on top
      if (chat.modal === "FRIEND_CHAT") {
        const userChats = user.chats;
        const updatedChatIndex = userChats.findIndex(
          (chat) => chat.id === chatID
        );
        const updatedChat = userChats[updatedChatIndex];
        if (updatedChat) {
          userChats.splice(updatedChatIndex, 1);
          userChats.unshift(updatedChat);
        }

        await usersCollection.updateOne(
          { _id: user._id },
          {
            $set: { chats: userChats },
          }
        );
      }

      await usersCollection.updateMany(
        { _id: { $in: chat.members.map((member) => new ObjectId(member.id)) } },
        {
          $push: {
            mailbox: {
              id_passed: chat._id.toString(),
              name: chat.name,
              modal: "MSG",
            },
          },
        }
      );

      pubsub.publish("NEW_MSG", {
        subChatMessages: {
          user: user.username,
          message,
          id: myNewID.toString(),
          timestamp,
          chatID,
        },
      });

      pubsub.publish("NEW_NOTIF", {
        subNotifs: {
          id_receiver: chat.members.map((member) => member.id),
          modal: "MSG",
          id_passed: chat._id.toString(),
          name: chat.name,
        },
      });

      return {
        info: "message added",
        message: {
          user: user.username,
          message,
          timestamp,
          id: myNewID.toString(),
        },
      };
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  // parmas: usern JWT, name of chat, modality of chat (PUBLIC or PRIVATE).
  // function: generate chat document
  // returns: info and chat
  createChat: async (
    _: unknown,
    params: { token: string; name: string; modal: string }
  ): Promise<{ info: string; chat: Chat }> => {
    try {
      const { name, modal, token } = params;
      if (modal !== "PUBLIC" && modal !== "PRIVATE") {
        throw new Error(
          "invalid chat modality, must be PUBLIC, PRIVATE or FRIEND_CHAT"
        );
      }

      if (
        modal === "PUBLIC" &&
        (await chatsCollection.findOne({
          name: name.toLowerCase(),
          modal: "PUBLIC",
        }))
      ) {
        throw new Error("chat name already taken");
      }

      const user = await checkToken(token);

      const newChat: ChatSchema = {
        name: name.toLowerCase(),
        modal,
        _id: new ObjectId(),
        messages: [],
        members: [{ id: user._id.toString(), username: user.username }],
      };

      await chatsCollection.insertOne(newChat);
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $push: { chats: { id: newChat._id.toString(), name: newChat.name } },
        }
      );

      return {
        info: "chat created",
        chat: {
          id: newChat._id.toString(),
          name,
          modal,
          messages: newChat.messages,
          members: newChat.members,
        },
      };
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  // parmas: user JWT and chat ID.
  // function: pushes user ID to chat members and chat ID to user chats
  // returns: confirmation string
  joinChat: async (
    _: unknown,
    params: { token: string; chatID: string }
  ): Promise<string> => {
    try {
      const { token, chatID } = params;

      const user = await checkToken(token);

      const chat = await chatsCollection.findOne({ _id: new ObjectId(chatID) });
      if (!chat) {
        throw new Error("invalid chat DID");
      }

      await chatsCollection.updateOne(
        { _id: chat._id },
        {
          $push: {
            members: { id: user._id.toString(), username: user.username },
          },
        }
      );

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $push: { chats: { id: chat._id.toString(), name: chat.name } },
        }
      );

      return "joined chat";
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  // parmas: user JWT and chat ID.
  // function: pulls user ID from chat members and chat ID from user chats
  // returns: confirmation string
  leaveChat: async (
    _: unknown,
    params: { token: string; chatID: string }
  ): Promise<string> => {
    try {
      const { token, chatID } = params;

      const user = await checkToken(token);

      const chat = await chatsCollection.findOne({ _id: new ObjectId(chatID) });
      if (!chat) {
        throw new Error("invalid chat ID");
      }

      await chatsCollection.updateOne(
        { _id: chat._id },
        {
          $pull: { members: { id: user._id.toString() } },
        }
      );

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $pull: { chats: { id: chat._id.toString() } },
        }
      );

      return "left chat";
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  // parmas: user JWT, ID of receiver user, modality of invitation (FRIEND or CHAT).
  // function: pushes invitation to receiver user mailbox
  // returns: confirmation string
  sendInvitation: async (
    _: unknown,
    params: {
      token: string;
      receiverID: string;
      modal: string;
      chatID?: string;
    }
  ): Promise<string> => {
    try {
      const { token, receiverID, modal } = params;

      if (modal !== "FRIEND" && modal !== "CHAT") {
        throw new Error("invalid invitation modality, must be FRIEND, CHAT");
      }

      const sender = await checkToken(token);

      const receiver = await usersCollection.findOne({
        _id: new ObjectId(receiverID),
      });

      if (!receiver) {
        throw new Error("invalid receiver ID");
      }

      if (modal === "CHAT") {
        const chat = await chatsCollection.findOne({
          _id: new ObjectId(params.chatID),
        });
        if (!chat) {
          throw new Error("invalid chat ID");
        }

        if (chat.modal === "FRIEND_CHAT") {
          throw new Error("cant send an invitation to a friend chat");
        }

        await usersCollection.updateOne(
          { _id: receiver._id },
          {
            $push: {
              mailbox: {
                modal,
                id_passed: chat._id.toString(),
                name: chat.name,
              },
            },
          }
        );

        pubsub.publish("NEW_NOTIF", {
          subNotifs: {
            id_receiver: [receiver._id.toString()],
            modal: "CHAT",
            id_passed: chat._id.toString(),
            name: chat.name,
          },
        });
      } else {
        await usersCollection.updateOne(
          { _id: receiver._id },
          {
            $push: {
              mailbox: {
                modal,
                id_passed: sender._id.toString(),
                name: sender.username,
              },
            },
          }
        );

        pubsub.publish("NEW_NOTIF", {
          subNotifs: {
            id_receiver: [receiver._id.toString()],
            modal: "FRIEND",
            id_passed: sender._id.toString(),
            name: sender.username,
          },
        });
      }

      return "invitation sent";
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  // parmas: user JWT and ID passed to invitation.
  // function: if friend request, push friend ID to user friendList.
  //           if chat invitation, adds chat to user chats and user to chat members
  // returns: confirmation string
  acceptInvitation: async (
    _: unknown,
    params: { token: string; invitID: string }
  ): Promise<string> => {
    try {
      const { token, invitID } = params;

      const user = await checkToken(token);

      const invitation = user.mailbox.find(
        (invit) => invit.id_passed === invitID
      );
      if (!invitation) {
        throw new Error("invalid invitation ID");
      }

      if (invitation.modal === "CHAT") {
        await usersCollection.updateOne(
          { _id: user._id },
          {
            $push: {
              chats: { id: invitation.id_passed, name: invitation.name },
            },
            $pull: { mailbox: { id_passed: invitation.id_passed } },
          }
        );

        await chatsCollection.updateOne(
          { _id: new ObjectId(invitation.id_passed) },
          {
            $push: {
              members: { id: user._id.toString(), username: user.username },
            },
          }
        );

        return "chat invitation accepted";
      } else {
        const newChatID = new ObjectId();

        await chatsCollection.insertOne({
          _id: newChatID,
          name: "FRIEND_CHAT",
          messages: [],
          modal: "FRIEND_CHAT",
          members: [
            { id: user._id.toString(), username: user.username },
            { id: invitation.id_passed, username: invitation.name },
          ],
        });

        await usersCollection.updateOne(
          { _id: user._id },
          {
            $push: {
              friendList: {
                id: invitation.id_passed,
                username: invitation.name,
                chat: newChatID.toString(),
              },
              chats: { id: newChatID.toString(), name: invitation.name },
            },
            $pull: { mailbox: { id_passed: invitation.id_passed } },
          }
        );

        await usersCollection.updateOne(
          { _id: new ObjectId(invitation.id_passed) },
          {
            $push: {
              friendList: {
                id: user._id.toString(),
                username: user.username,
                chat: newChatID.toString(),
              },
              chats: { id: newChatID.toString(), name: user.username },
            },
          }
        );

        return "friend request accepted";
      }
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  // parmas: user JWT, ID of invitatin
  // function: pulls invitation ID from user mailbox
  // returns: confirmation string
  declineInvitation: async (
    _: unknown,
    params: { token: string; invitID: string }
  ) => {
    try {
      const { token, invitID } = params;

      const user = await checkToken(token);

      const checkUpdate = await usersCollection.updateOne(
        { _id: user._id },
        {
          $pull: { mailbox: { id_passed: invitID } },
        }
      );

      if (!checkUpdate) {
        throw new Error("invalid invitation ID");
      }
      return "invitation removed";
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  readMessages: async (
    _: unknown,
    params: { token: string; chatID: string }
  ): Promise<string> => {
    try {
      const { token, chatID } = params;

      const user = await checkToken(token);

      const checkUpdate = await usersCollection.updateOne(
        { _id: user._id },
        {
          $pull: { mailbox: { id_passed: chatID, modal: "MSG" } },
        }
      );

      if (!checkUpdate) {
        throw new Error("invalid chat ID");
      }
      return "messages read";
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  // parmas: user JWT, ID of fiend
  // function: pulls friend ID from user friendList
  // returns: confirmation string
  removeFriend: async (
    _: unknown,
    params: { token: string; friendID: string }
  ): Promise<string> => {
    try {
      const { token, friendID } = params;

      const user = await checkToken(token);

      const chatID = user.friendList.find(
        (friend) => friend.id === friendID
      )?.chat;

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $pull: {
            friendList: { id: friendID },
            chats: { id: chatID },
          },
        }
      );

      await usersCollection.updateOne(
        { _id: new ObjectId(friendID) },
        {
          $pull: {
            friendList: { id: user._id.toString() },
            chats: { id: chatID },
          },
        }
      );

      await chatsCollection.deleteOne({ _id: new ObjectId(chatID) });

      return "friend removed";
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  clearMailbox: async (_: unknown, params: { token: string }) => {
    try {
      const user = await checkToken(params.token);

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: { mailbox: [] },
        }
      );

      return "mailbox cleared";
    } catch (e) {
      throw new Error((e as Error).message);
    }
  },
  clearChats: async (_: unknown): Promise<string> => {
    try {
      await chatsCollection.deleteMany({});
    } catch (e) {
      throw new Error((e as Error).message);
    }
    return "All chats cleared.";
  },
  clearUsers: async (_: unknown): Promise<string> => {
    try {
      await usersCollection.deleteMany({});
    } catch (e) {
      throw new Error((e as Error).message);
    }
    return "All users cleared.";
  },
};

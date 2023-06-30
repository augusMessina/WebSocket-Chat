import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../main";
import { checkToken } from "../lib/jwt";
import { chatsCollection } from "../db/dbconnection";
import { ObjectId } from "mongodb";

export const Subscription = {
  // subChatMessages: {
  //   subscribe: () => pubsub.asyncIterator(["NEW_MSG"]),
  // },
  subChatMessages: {
    subscribe: withFilter(
      () => pubsub.asyncIterator("NEW_MSG"),
      async (payload, params: { token: string; chatID: string }) => {
        try {
          const { token, chatID } = params;

          const user = await checkToken(token);

          const chat = await chatsCollection.findOne({
            _id: new ObjectId(chatID),
          });
          if (
            !chat ||
            chat.members.includes({
              id: user._id.toString(),
              username: user.username,
            })
          ) {
            throw new Error("invalid chat ID or user does not belong to chat");
          }

          return payload.subChatMessages.chatID === chatID;
        } catch (e) {
          throw new Error((e as Error).message);
        }
      }
    ),
  },
  subNotifs: {
    subscribe: withFilter(
      () => pubsub.asyncIterator("NEW_NOTIF"),
      async (payload, params: { token: string }) => {
        const { token } = params;
        const user = await checkToken(token);
        return payload.subNotifs.id_receiver.includes(user._id.toString());
      }
    ),
  },
};

import { pubsub } from "../main";

export const Subscription = {
  newMessage: {
    subscribe: () => pubsub.asyncIterator(["NEW_MSG"]),
  },
};

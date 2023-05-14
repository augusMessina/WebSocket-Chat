import { messages } from "../db/dbconnection";
import { pubsub } from "../main";
// import { ObjectId } from "mongodb";
// import { Match } from "../types";
// import { MatchSchema } from "../db/schema";

// import { pubsub } from "../main";
// import { withFilter } from "graphql-subscriptions";

export const Subscription = {
  newMessage: {
    subscribe: () => pubsub.asyncIterator(["NEW_MSG"]),
  },
};

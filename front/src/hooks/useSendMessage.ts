import { JWTContext } from "@/context/JWTContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useContext } from "react";

const ADD_MESSAGE = gql`
  mutation AddMessage(
    $token: String!
    $message: String!
    $chatId: String!
    $timestamp: Float!
  ) {
    addMessage(
      token: $token
      message: $message
      chatID: $chatId
      timestamp: $timestamp
    ) {
      info
    }
  }
`;

export default function useSendMessage() {
  const { JWT } = useContext(JWTContext);
  const [mutationFuntcion] = useMutation(ADD_MESSAGE);

  const sendMessage = async (message: string, chatId: string) => {
    await mutationFuntcion({
      variables: {
        token: JWT,
        message,
        chatId,
        timestamp: new Date().getTime(),
      },
    });
  };

  return {
    sendMessage,
  };
}

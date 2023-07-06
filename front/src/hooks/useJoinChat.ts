import { JWTContext } from "@/context/JWTContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useContext } from "react";
import useUserData from "./useUserData";

const JOIN_CHAT = gql`
  mutation JoinChat($token: String!, $chatId: String!) {
    joinChat(token: $token, chatID: $chatId)
  }
`;

export default function useJoinChat() {
  const { JWT } = useContext(JWTContext);
  const { refetchData } = useUserData();
  const [mutationFuntcion] = useMutation(JOIN_CHAT);

  const joinChat = async (chatId: string) => {
    await mutationFuntcion({
      variables: {
        token: JWT,
        chatId,
      },
    });
    await refetchData();
  };

  return {
    joinChat,
  };
}

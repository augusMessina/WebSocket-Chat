import { JWTContext } from "@/context/JWTContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useContext } from "react";
import useUserData from "./useUserData";

const LEAVE_CHAT = gql`
  mutation LeaveChat($token: String!, $chatId: String!) {
    leaveChat(token: $token, chatID: $chatId)
  }
`;

export default function useSendInvitation() {
  const { JWT } = useContext(JWTContext);
  const { refetchData } = useUserData();
  const [mutationFuntcion] = useMutation(LEAVE_CHAT);

  const leaveChat = async (chatId: string) => {
    await mutationFuntcion({
      variables: {
        token: JWT,
        chatId,
      },
    });
    await refetchData();
  };

  return {
    leaveChat,
  };
}

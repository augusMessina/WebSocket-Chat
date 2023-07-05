import { JWTContext } from "@/context/JWTContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useContext } from "react";
import useUserData from "./useUserData";

const SEND_INVITATION = gql`
  mutation Mutation(
    $token: String!
    $receiverId: String!
    $modal: String!
    $chatId: String
  ) {
    sendInvitation(
      token: $token
      receiverID: $receiverId
      modal: $modal
      chatID: $chatId
    )
  }
`;

export default function useSendInvitation() {
  const { JWT } = useContext(JWTContext);
  const { refetchData } = useUserData();
  const [mutationFuntcion] = useMutation(SEND_INVITATION);

  const sendInvitation = async (
    receiverId: string,
    modal: string,
    chatId?: string
  ) => {
    await mutationFuntcion({
      variables: {
        token: JWT,
        receiverId,
        modal,
        chatId,
      },
    });
    await refetchData();
  };

  return {
    sendInvitation,
  };
}

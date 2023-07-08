import { JWTContext } from "@/context/JWTContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useContext } from "react";
import useUserData from "./useUserData";
import { UserDataContext } from "@/context/UserDataContext";

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
  const { refetchData, invitSent, setInvitSent } = useContext(UserDataContext);
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

    const newInvitSent = invitSent;
    newInvitSent?.push({
      id_passed: receiverId,
      modal,
      chatID: chatId,
    });
    // await refetchData();
  };

  return {
    sendInvitation,
  };
}

import { JWTContext } from "@/context/JWTContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useContext } from "react";

const SEND_INVITATION = gql`
  mutation Mutation($token: String!, $receiverId: String!, $modal: String!) {
    sendInvitation(token: $token, receiverID: $receiverId, modal: $modal)
  }
`;

export default function useSendInvitation() {
  const { JWT } = useContext(JWTContext);
  const [mutationFuntcion] = useMutation(SEND_INVITATION);

  const sendInvitation = async (receiverId: string, modal: string) => {
    await mutationFuntcion({
      variables: {
        token: JWT,
        receiverId,
        modal,
      },
    });
  };

  return {
    sendInvitation,
  };
}

import { JWTContext } from "@/context/JWTContext";
import {
  ApolloQueryResult,
  OperationVariables,
  gql,
  useMutation,
  useQuery,
} from "@apollo/client";
import { useContext } from "react";

type QueryResponse = {
  getUserData: {
    username: string;
    chats: [
      {
        id: string;
        name: string;
        modal: string;
        unreadMessages: number;
      }
    ];
    mailbox: [
      {
        id_passed: string;
        modal: string;
        name: string;
      }
    ];
    friendList: [
      {
        id: string;
        username: string;
      }
    ];
  };
};

const ACCEPT_INVITATION = gql`
  mutation AcceptInvitation($token: String!, $invitId: String!) {
    acceptInvitation(token: $token, invitID: $invitId)
  }
`;

const DECLINE_INVITATION = gql`
  mutation DeclineInvitation($token: String!, $invitId: String!) {
    declineInvitation(token: $token, invitID: $invitId)
  }
`;

export default function useRespondMail(refetchFunction: any) {
  const { JWT } = useContext(JWTContext);

  const [acceptInvitation] = useMutation(ACCEPT_INVITATION);
  const [declineInvitation] = useMutation(DECLINE_INVITATION);

  const accept = async (invitId: string) => {
    await acceptInvitation({
      variables: {
        token: JWT,
        invitId,
      },
    });
    await refetchFunction();
  };

  const decline = async (invitId: string) => {
    await declineInvitation({
      variables: {
        token: JWT,
        invitId,
      },
    });
    await refetchFunction();
  };

  return {
    accept,
    decline,
  };
}

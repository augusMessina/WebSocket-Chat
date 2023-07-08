import { JWTContext } from "@/context/JWTContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useContext } from "react";
import useUserData from "./useUserData";

const REMOVE_FRIEND = gql`
  mutation RemoveFriend($token: String!, $friendId: String!) {
    removeFriend(token: $token, friendID: $friendId)
  }
`;

export default function useSendInvitation() {
  const { JWT } = useContext(JWTContext);
  const { refetchData } = useUserData();
  const [mutationFuntcion] = useMutation(REMOVE_FRIEND);

  const removeFriend = async (friendId: string) => {
    await mutationFuntcion({
      variables: {
        token: JWT,
        friendId,
      },
    });
    await refetchData();
  };

  return {
    removeFriend,
  };
}

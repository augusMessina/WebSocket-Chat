import { JWTContext } from "@/context/JWTContext";
import { gql, useQuery } from "@apollo/client";
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

const GET_USER_DATA = gql`
  query GetUserData($token: String!) {
    getUserData(token: $token) {
      username
      chats {
        id
        name
        modal
        unreadMessages
      }
      mailbox {
        id_passed
        modal
        name
      }
      friendList {
        id
        username
      }
    }
  }
`;

export default function useUserData() {
  const { JWT } = useContext(JWTContext);

  const { data, loading, error, refetch } = useQuery<QueryResponse>(
    GET_USER_DATA,
    {
      variables: {
        token: JWT,
      },
    }
  );

  console.log(data?.getUserData.mailbox);

  return {
    username: data?.getUserData.username,
    chats: data?.getUserData.chats,
    mailbox: data?.getUserData.mailbox,
    friendList: data?.getUserData.friendList,
    loading,
    error,
    refetchData: refetch,
  };
}

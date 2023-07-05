import { JWTContext } from "@/context/JWTContext";
import { gql, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import useUserData from "./useUserData";

type QueryResponse = {
  getPublicChats: {
    id: string;
    name: string;
    members: {
      username: string;
    }[];
  }[];
};

const GET_PUBLIC_CHATS = gql`
  query GetPublicChats($searchName: String!) {
    getPublicChats(searchName: $searchName) {
      id
      members {
        username
      }
      name
    }
  }
`;

export default function useGetUsers() {
  const { username } = useUserData();
  const [searchName, setSearchName] = useState<string>("");

  const [publicChats, setPublicChats] = useState<
    {
      id: string;
      name: string;
      members: {
        username: string;
      }[];
      joined: boolean;
    }[]
  >();

  const { data, loading, error, refetch } = useQuery<QueryResponse>(
    GET_PUBLIC_CHATS,
    {
      variables: {
        searchName,
      },
      onCompleted: (data) => {
        setPublicChats(
          data.getPublicChats
            .filter(
              (chat) => !chat.members.some((user) => user.username === username)
            )
            .map((chat) => ({ ...chat, joined: false }))
        );
      },
    }
  );

  return {
    setSearchName,
    publicChats,
    setPublicChats,
    loading,
    error,
    refetch,
  };
}

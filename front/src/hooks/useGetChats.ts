import { JWTContext } from "@/context/JWTContext";
import { gql, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import useUserData from "./useUserData";
import { UserDataContext } from "@/context/UserDataContext";

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
  const { username } = useContext(UserDataContext);
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

  const [allPublicChats, setAllPublicChats] = useState<
    {
      id: string;
      name: string;
      members: {
        username: string;
      }[];
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
            .filter((chat) => {
              return !chat.members.some((user) => user.username === username);
            })
            .map((chat) => ({ ...chat, joined: false }))
        );
        setAllPublicChats(data.getPublicChats);
      },
      fetchPolicy: "network-only",
    }
  );

  return {
    setSearchName,
    publicChats,
    setPublicChats,
    allPublicChats,
    loading,
    error,
    refetch,
  };
}

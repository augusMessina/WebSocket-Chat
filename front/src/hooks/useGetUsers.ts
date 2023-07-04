import { JWTContext } from "@/context/JWTContext";
import { gql, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import useUserData from "./useUserData";

type QueryResponse = {
  getUsers: {
    id: string;
    username: string;
  }[];
};

const GET_USERS = gql`
  query GetUsers($searchName: String!) {
    getUsers(searchName: $searchName) {
      id
      username
    }
  }
`;

export default function useGetUsers() {
  const { username, invitSent } = useUserData();
  const [searchName, setSearchName] = useState<string>("");

  const { data, loading, error, refetch } = useQuery<QueryResponse>(GET_USERS, {
    variables: {
      searchName,
    },
  });

  return {
    setSearchName,
    users: data?.getUsers.filter((user) => {
      return (
        user.username !== username &&
        !invitSent?.some(
          (sent) => sent.id_passed === user.id && sent.modal === "FRIEND"
        )
      );
    }),
    loading,
    error,
    refetch,
  };
}

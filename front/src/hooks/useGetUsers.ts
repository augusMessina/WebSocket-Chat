import { JWTContext } from "@/context/JWTContext";
import { gql, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import useUserData from "./useUserData";
import { UserDataContext } from "@/context/UserDataContext";

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
  const { username, invitSent, friends } = useContext(UserDataContext);
  const [searchName, setSearchName] = useState<string>("");

  const [users, setUsers] = useState<
    {
      id: string;
      username: string;
      invited: boolean;
    }[]
  >();

  const { data, loading, error, refetch } = useQuery<QueryResponse>(GET_USERS, {
    variables: {
      searchName,
    },
    onCompleted: (data) => {
      setUsers(
        data.getUsers
          .filter((user) => {
            return (
              user.username !== username &&
              !invitSent?.some(
                (sent: any) =>
                  sent.id_passed === user.id && sent.modal === "FRIEND"
              ) &&
              !friends?.some((friend: any) => friend.id === user.id)
            );
          })
          .map((user) => ({ ...user, invited: false }))
      );
    },
    fetchPolicy: "network-only",
  });

  return {
    setSearchName,
    users,
    setUsers,
    loading,
    error,
    refetch,
  };
}

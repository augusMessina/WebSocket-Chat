import { JWTContext } from "@/context/JWTContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useContext } from "react";
import useSendInvitation from "./useSendInvitation";
import useUserData from "./useUserData";

const CREATE_CHAT = gql`
mutation CreateChat($token: String!, $name: String!, $modal: String!) {
    createChat(token: $token, name: $name, modal: $modal) {
      chat {
        id
      }
    }
  }
`;

export default function useCreateChat() {
  const { JWT } = useContext(JWTContext);
  const {sendInvitation} = useSendInvitation();
  const {refetchData} = useUserData()  

  const [mutationFuntcion] = useMutation<{createChat:{chat:{id: string}}}>(CREATE_CHAT);

  const createChat = async (name: string, modal: string, members: string[]) => {
    const newChat = await mutationFuntcion({
      variables: {
        token: JWT,
        name,
        modal,
      },
    });
    members.forEach(async member => {
        await sendInvitation(member, 'CHAT', newChat.data?.createChat.chat.id);
    });
    await refetchData()
  };

  return {
    createChat,
  };
}

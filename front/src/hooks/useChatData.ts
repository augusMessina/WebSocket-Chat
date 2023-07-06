import { JWTContext } from "@/context/JWTContext";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useContext, useState } from "react";

type QueryResponse = {
  getChatData: {
    messages: {
      id: string;
      user: string;
      message: string;
      timestamp: number;
    }[];
    members: {
      id: string;
      username: string;
    }[];
    modal: string;
  };
};

type SubResponse = {
  subChatMessages: {
    id: string;
    user: string;
    message: string;
    timestamp: number;
  };
};

const GET_CHAT_DATA = gql`
  query GetChatData($token: String!, $chatId: String!) {
    getChatData(token: $token, chatID: $chatId) {
      messages {
        id
        user
        message
        timestamp
      }
      members {
        id
        username
      }
      modal
    }
  }
`;

const SUB_MESSAGES = gql`
  subscription SubChatMessages($token: String!, $chatId: String!) {
    subChatMessages(token: $token, chatID: $chatId) {
      id
      user
      message
      timestamp
    }
  }
`;

const READ_MESSAGES = gql`
  mutation ReadMessages($token: String!, $chatId: String!) {
    readMessages(token: $token, chatID: $chatId)
  }
`;

export default function useChatData(chatId: string) {
  const { JWT } = useContext(JWTContext);

  const { data, loading, error, refetch } = useQuery<QueryResponse>(
    GET_CHAT_DATA,
    {
      variables: {
        token: JWT,
        chatId,
      },
      onCompleted(data) {
        setMessageList(data.getChatData.messages);
      },
    }
  );

  const [readMessages] = useMutation(READ_MESSAGES);

  const [messageList, setMessageList] = useState<
    { user: string; message: string; id: string; timestamp: number }[]
  >([]);

  const sub = useSubscription<SubResponse>(SUB_MESSAGES, {
    onData: (data) => {
      console.log("message received");
      if (data.data.data) {
        setMessageList([...messageList, data.data.data.subChatMessages]);
        readMessages({
          variables: {
            token: JWT,
            chatId: chatId,
          },
        });
      }
    },
    variables: {
      token: JWT,
      chatId,
    },
  });

  return {
    messages: messageList,
    members: data?.getChatData.members,
    modal: data?.getChatData.modal,
    dataRefetch: refetch,
  };
}

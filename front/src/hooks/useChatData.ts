import { JWTContext } from "@/context/JWTContext";
import { gql, useQuery, useSubscription } from "@apollo/client";
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
  query GetChatData($chatId: String!) {
    getChatData(chatID: $chatId) {
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

export default function useChatData(chatId: string) {
  const { JWT } = useContext(JWTContext);

  const { data, loading, error, refetch } = useQuery<QueryResponse>(
    GET_CHAT_DATA,
    {
      variables: {
        chatId,
      },
      onCompleted(data) {
        setMessageList(data.getChatData.messages);
      },
    }
  );

  const [messageList, setMessageList] = useState<
    { user: string; message: string; id: string; timestamp: number }[]
  >([]);

  const sub = useSubscription<SubResponse>(SUB_MESSAGES, {
    onData: (data) => {
      console.log("message received");
      if (data.data.data) {
        setMessageList([...messageList, data.data.data.subChatMessages]);
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

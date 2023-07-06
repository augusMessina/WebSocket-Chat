import useUser from "@/hooks/useUser";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { createContext, useState } from "react";

type CredentialsContextProviderProps = {
    children: React.ReactNode;
}

type QueryResponse = {
    getUserData: {
      id: string;
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
      invitSent: [
        {
          id_passed: string;
          modal: string;
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
  
  type SubResponse = {
    subNotifs: {
      id_passed: string;
      modal: string;
    };
  };
  
  const GET_USER_DATA = gql`
    query GetUserData($token: String!) {
      getUserData(token: $token) {
        id
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
        invitSent {
          id_passed
          modal
        }
      }
    }
  `;
  
  const SUB_NOTIFS = gql`
    subscription SubNotifs($token: String!) {
      subNotifs(token: $token) {
        id_passed
        modal
      }
    }
  `;

export const UserDataContext = createContext<any>({})

export default function UserDataContextProvider(props: CredentialsContextProviderProps) {
    const {logout, JWT} = useUser()

    const [chatID, setChatID] = useState<string>('');
    const [chatName, setChatName] = useState<string>('');

    const [newMails, setNewMails] = useState<boolean>(false);

    const [chats, setChats] = useState<
    | {
        id: string;
        name: string;
        modal: string;
        unreadMessages: number;
      }[]
    | undefined
    >();

    const [friends, setFriends] = useState<
        | {
            id: string;
            username: string;
            invited: boolean;
        }[]
        | undefined
    >();

    const [mailbox, setMailbox] = useState<
        {
        id_passed: string;
        name: string;
        modal: string;
        }[]
    >();

    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const { data, loading, error, refetch } = useQuery<QueryResponse>(
        GET_USER_DATA,
        {
        variables: {
            token: JWT,
        },
        onCompleted: (data) => {
            setChats(data?.getUserData.chats);
            setFriends(
            data.getUserData.friendList.map((friend) => ({
                id: friend.id,
                username: friend.username,
                invited: false,
            }))
            );
            setMailbox(data.getUserData.mailbox);
            if(data.getUserData.mailbox.length > 0){
                setNewMails(true);
            }
            setIsLoaded(true);
        },
        fetchPolicy: "network-only",
        }
    );

    const sub = useSubscription<SubResponse>(SUB_NOTIFS, {
        onData: (data) => {
        console.log("notif received");
        if (data.data.data) {
            const myData = data.data.data;

            if (myData.subNotifs.modal === "MSG") {
                
                
                    
                    const newChats = chats?.map((chat) => {
                        if (chat.id === myData.subNotifs.id_passed && chat.id !== chatID) {
                            return {
                            id: chat.id,
                            name: chat.name,
                            modal: chat.modal,
                            unreadMessages: chat.unreadMessages + 1,
                            };
                        } else {
                            return chat;
                        }
                    });
                    
                    const editedChatIndex = chats?.findIndex(chat => chat.id === myData.subNotifs.id_passed);
                    let editedChat;
                    if (chats && typeof editedChatIndex !== 'undefined' && newChats){
                        editedChat = newChats[editedChatIndex];
                        newChats.splice(editedChatIndex, 1);
                        newChats.unshift(editedChat)
                    }
                    
                   

                    setChats(newChats);
                
            } else {
                setNewMails(true);
            }
        }
        },
        variables: {
        token: JWT,
        },
    });


    return (
        <UserDataContext.Provider value={{username: data?.getUserData.username, chats, setChats, newMails, setNewMails, mailbox, refetchData: refetch, isLoaded, chatID, setChatID, chatName, setChatName, logout, invitSent: data?.getUserData.invitSent, friends}}>
            {props.children}
        </UserDataContext.Provider>
    )
}
import useUser from "@/hooks/useUser";
import useUserData from "@/hooks/useUserData";
import { ChatBlock, ErrorMessage, LogoutButton, UserButton, Menu, MenuCentered, MessageBubble, MessageInput, MessagesDisplay, NewMessage, SendButton, SendMessageDiv, UserBubble, Wrapper, MailItem, LoginButton } from "@/styles/myStyledComponents";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import ChatSelect from "./ChatSelect";
import ChatDisplay from "./ChatDisplay";
import Popup from "reactjs-popup";
import Topbar from "./Topbar";
import UserDataContextProvider from "@/context/UserDataContext";


const Chat = () => {

    const {logout} = useUser()
    const {username, chats, setChats, mailbox, refetchData, isLoaded, invitSent, friends} = useUserData()

    const [chatID, setChatID] = useState<string>('');
    const [chatName, setChatName] = useState<string>('');

    return (
        <>
        <UserDataContextProvider>
        <Topbar></Topbar>
        <Wrapper>
        <ChatSelect/>
        <ChatDisplay></ChatDisplay>
        </Wrapper>
        </UserDataContextProvider>
        </>
    );
};

export default Chat;
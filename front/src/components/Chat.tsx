import useUser from "@/hooks/useUser";
import useUserData from "@/hooks/useUserData";
import { ChatBlock, ErrorMessage, LogoutButton, UserButton, Menu, MenuCentered, MessageBubble, MessageInput, MessagesDisplay, NewMessage, SendButton, SendMessageDiv, UserBubble, Wrapper, Mailbox, MailItem, LoginButton } from "@/styles/myStyledComponents";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import ChatSelect from "./ChatSelect";
import ChatDisplay from "./ChatDisplay";
import Popup from "reactjs-popup";
import Topbar from "./Topbar";

const Chat = () => {

    const {logout} = useUser()
    const {username, chats, mailbox, refetchData} = useUserData()

    const [chatID, setChatID] = useState<string>('');
    const [chatName, setChatName] = useState<string>('');

    return (
        <>
        <Topbar mailbox={mailbox} username={username} logoutFunction={logout} refetchFunction={refetchData}></Topbar>
        <Wrapper>
        <ChatSelect chats={chats} chatID={chatID} setChatID={setChatID} setChatName={setChatName}/>
        <ChatDisplay chatID={chatID} name={chatName} username={username}></ChatDisplay>
        </Wrapper>
        </>
    );
};

export default Chat;
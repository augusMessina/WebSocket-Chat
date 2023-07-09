import useUser from "@/hooks/useUser";
import useUserData from "@/hooks/useUserData";
import { ChatBlock, ErrorMessage, LogoutButton, UserButton, Menu, MenuCentered, MessageBubble, MessageInput, MessagesDisplay, NewMessage, SendButton, UserBubble, Wrapper, MailItem, LoginButton } from "@/styles/myStyledComponents";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import ChatSelect from "./ChatSelect";
import ChatDisplay from "./ChatDisplay";
import Popup from "reactjs-popup";
import Topbar from "./Topbar";
import UserDataContextProvider, { UserDataContext } from "@/context/UserDataContext";
import BotChatDisplay from "./BotChatDisplay";


const Chat = () => {

    const {chatID} = useContext(UserDataContext);

    return (
        <>
        <Topbar></Topbar>
        <Wrapper>
        <ChatSelect/>
        {
            chatID === 'ChatX' ?
            <BotChatDisplay></BotChatDisplay>
            :
            <ChatDisplay></ChatDisplay>
        }
        </Wrapper>
        </>
    );
};

export default Chat;
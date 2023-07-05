import useGetChats from "@/hooks/useGetChats";
import useGetUsers from "@/hooks/useGetUsers";
import useSendInvitation from "@/hooks/useSendInvitation";
import { CreateChatForm, DisabledButton, InvitationButton, LoginButton, MailItem, MessageInput, NavBar, NavItem, PopupContainer, PopupInput, PopupScrollDiv, UserItem } from "@/styles/myStyledComponents";
import { useState } from "react";
import ChatsSearch from "./ChatsSearch";
import useUserData from "@/hooks/useUserData";
import CreateChat from "./CreateChat";

export default function ChatsPopup () {

    

    const [colorJoin, setColorJoin] = useState<string>('nav-chosen')
    const [colorCreate, setColorCreate] = useState<string>('nav-idle')

    const [showJoin, setShowJoin] = useState<boolean>(true)

    return (
        <PopupContainer>
            <NavBar>
                <NavItem className={colorJoin} onClick={() => {
                    setColorJoin('nav-chosen');
                    setColorCreate('nav-idle');
                    setShowJoin(true);
                }}>Join a chat</NavItem>
                <NavItem className={colorCreate} onClick={() => {
                    setColorCreate('nav-chosen');
                    setColorJoin('nav-idle');
                    setShowJoin(false);
                }}>Create a chat</NavItem>
            </NavBar>
            {
                showJoin ? 
                
                <ChatsSearch></ChatsSearch>
                
                : 
                
                <CreateChat></CreateChat>
                
            }
            
        </PopupContainer>
    )
}
import { ChatBlock, ChatItem, ChatsDiv, RoundButton, UnreadMsgs, UserItem } from "@/styles/myStyledComponents";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import Popup from "reactjs-popup";
import UsersPopup from "./UsersPopup";
import ChatsPopup from "./ChatsPopup";
import { UserDataContext } from "@/context/UserDataContext";

type ChatList = { id: string; name: string; modal: string; unreadMessages: number; }[] | undefined;

export default function ChatSelect () {

    const handleClose = () => {
        console.log('modal closed');
        setIsOpen(false)
    };

    const handleOpen = () => {
        console.log('modal closed');
        setIsOpen(true)
    };


    const {chats, setChats, chatID, setChatID, setChatName, isLoaded} = useContext(UserDataContext);
    
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return(
        <>
        <ChatBlock>
            Groups
            <ChatsDiv>
            {
                chats?.map((chat: any, index: number) => {
                    if(chat.modal === 'CHAT'){
                        const backColor = chatID === chat.id ? '#322c34a7' : '';
                        return <ChatItem key={chat.id} style={{background: `${backColor}`}} onClick={() => {
                            setChatID(chat.id);
                            setChatName(chat.name);
                            setChats(chats.map((chat: any, subindex: number) => {
                                if(subindex === index){
                                    return {
                                        id: chat.id,
                                        modal: chat.modal,
                                        name: chat.name,
                                        unreadMessages: 0
                                    }
                                }
                                else{
                                    return chat;
                                }
                            }));
                        }}>{chat.name}  { chat.unreadMessages>0 && <UnreadMsgs>{chat.unreadMessages}</UnreadMsgs>}
                        </ChatItem>
                    }
                })
            }
            <RoundButton onClick={handleOpen}>+</RoundButton>
            <Popup open={isOpen} modal overlayStyle={{background: '#000000a7'}}>
                <ChatsPopup close={handleClose} />
            </Popup>
            </ChatsDiv>
        </ChatBlock>
        <ChatBlock style={{color: 'white'}}>
            Friends
            <ChatsDiv>
                <ChatItem style={{background: `${chatID === 'ChatX' ? '#322c34a7' : ''}`}} onClick={() => {
                    setChatID('ChatX');
                    setChatName('ChatX Bot')
                }}>
                    ChatX Bot
                </ChatItem>
                {
                    chats?.map((chat: any, index: number) => {
                        if(chat.modal === 'FRIEND'){
                            const backColor = chatID === chat.id ? '#322c34a7' : '';
                            return <ChatItem key={chat.id} style={{background: `${backColor}`}} onClick={() => {
                                setChatID(chat.id);
                                setChatName(chat.name);
                                setChats(chats.map((chat: any, subindex: number) => {
                                    if(subindex === index){
                                        return {
                                            id: chat.id,
                                            modal: chat.modal,
                                            name: chat.name,
                                            unreadMessages: 0
                                        }
                                    }
                                    else{
                                        return chat;
                                    }
                                }));
                            }}>{chat.name} { chat.unreadMessages>0 && <UnreadMsgs>{chat.unreadMessages}</UnreadMsgs>}
                            </ChatItem>
                        }
                    })
                }
            <Popup trigger={<RoundButton>+</RoundButton>} modal overlayStyle={{background: '#000000a7'}}>
                <UsersPopup></UsersPopup>
            </Popup>
            </ChatsDiv>
        </ChatBlock>
        </>
    )
}
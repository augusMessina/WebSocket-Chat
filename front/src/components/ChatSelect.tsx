import { ChatBlock, ChatItem, ChatsDiv, RoundButton, UnreadMsgs } from "@/styles/myStyledComponents";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Popup from "reactjs-popup";
import UsersPopup from "./UsersPopup";
import ChatsPopup from "./ChatsPopup";

type ChatList = { id: string; name: string; modal: string; unreadMessages: number; }[] | undefined;

export default function ChatSelect (props:{chats: ChatList, setChats: any, chatID:string, setChatID: Dispatch<SetStateAction<string>>, setChatName: Dispatch<SetStateAction<string>>, isLoaded: boolean}) {

    const {chats, setChats, chatID, setChatID, setChatName, isLoaded} = props;

    const [unreadMsgs, setUnreadMsgs] = useState(chats?.map(chat => chat?.unreadMessages))
    
    useEffect(() => {
        if(isLoaded && chats && chats.length > 0){
            setChatID(chats[0].id)
            setChatName(chats[0].name)
        }
    }, [isLoaded, setChatID, setChatName])

    return(
        <>
        <ChatBlock>
            Groups
            <ChatsDiv>
            {
                chats?.map((chat, index) => {
                    if(chat.modal === 'CHAT'){
                        const borderColor = chatID === chat.id ? 'white' : 'transparent';
                        return <ChatItem key={chat.id} style={{border: `2px solid ${borderColor}`}} onClick={() => {
                            setChatID(chat.id);
                            setChatName(chat.name);
                            setChats(chats.map((chat, subindex) => {
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
            <Popup trigger={<RoundButton>+</RoundButton>} modal overlayStyle={{background: '#000000a7'}}>
                <ChatsPopup></ChatsPopup>
            </Popup>
            </ChatsDiv>
        </ChatBlock>
        <ChatBlock style={{color: 'white'}}>
            Friends
            <ChatsDiv>
            {
                chats?.map((chat, index) => {
                    if(chat.modal === 'FRIEND'){
                        const backColor = chatID === chat.id ? '#322c34a7' : '';
                        return <ChatItem key={chat.id} style={{background: `${backColor}`}} onClick={() => {
                            setChatID(chat.id);
                            setChatName(chat.name);
                            setChats(chats.map((chat, subindex) => {
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
import { ChatBlock, ChatItem, ChatsDiv, RoundButton, UnreadMsgs } from "@/styles/myStyledComponents";
import { Dispatch, SetStateAction, useEffect } from "react";
import Popup from "reactjs-popup";
import UsersPopup from "./UsersPopup";

type ChatList = [{id: string, name: string, modal: string, unreadMessages: number}] | undefined;

export default function ChatSelect (props:{chats: ChatList, chatID:string, setChatID: Dispatch<SetStateAction<string>>, setChatName: Dispatch<SetStateAction<string>>}) {

    const {chats, chatID, setChatID, setChatName} = props;
    
    useEffect(() => {
        if(chats && chats.length > 0){
            setChatID(chats[0].id)
            setChatName(chats[0].name)
        }
    }, [chats, setChatID, setChatName])

    return(
        <>
        <ChatBlock>
            Groups
            <ChatsDiv>
            {
                chats?.map(chat => {
                    if(chat.modal === 'CHAT'){
                        const borderColor = chatID === chat.id ? 'white' : 'transparent';
                        return <ChatItem key={chat.id} style={{border: `2px solid ${borderColor}`}} onClick={() => {
                            setChatID(chat.id);
                            setChatName(chat.name);
                        }}>{chat.name} <UnreadMsgs>{chat.unreadMessages}</UnreadMsgs></ChatItem>
                    }
                })
            }
            <RoundButton>+</RoundButton>
            </ChatsDiv>
        </ChatBlock>
        <ChatBlock style={{color: 'white'}}>
            Friends
            <ChatsDiv>
            {
                chats?.map(chat => {
                    if(chat.modal === 'FRIEND'){
                        const backColor = chatID === chat.id ? '#322c34a7' : '';
                        return <ChatItem key={chat.id} style={{background: `${backColor}`}} onClick={() => {
                            setChatID(chat.id);
                            setChatName(chat.name);
                        }}>{chat.name} <UnreadMsgs>{chat.unreadMessages}</UnreadMsgs></ChatItem>
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
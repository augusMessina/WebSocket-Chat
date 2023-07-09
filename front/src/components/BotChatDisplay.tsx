import useChatData from "@/hooks/useChatData";
import useSendMessage from "@/hooks/useSendMessage";
import { ChatBlock, ChatItem, ChatTitle, DisabledButton, InvitationButton, MessageBubble, MessageInput, MessagesDisplay, NewMessage, PopupContainer, PopupScrollDiv, SendButton, SendMessageForm, ThreeDotsLabel, UserBubble, UserItem } from "@/styles/myStyledComponents";
import { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "@/context/UserDataContext";
import Popup from "reactjs-popup";
import useSendInvitation from "@/hooks/useSendInvitation";
import useLeaveChat from "@/hooks/useLeaveChat";
import useRemoveFriend from "@/hooks/useRemoveFriend";
import { useChat } from 'ai/react'

export default function BotChatDisplay () {

    const {username, chatName} = useContext(UserDataContext);

    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: '/api/chat'
      })

    const messagesDisplayRef = useRef<HTMLDivElement>(null);



    // cada vez que messageList varíe (se añade un mensaje) hace
    // que el scroll baje
    useEffect(() => {
        if(messagesDisplayRef.current)
            messagesDisplayRef.current.scrollTop = messagesDisplayRef.current.scrollHeight;
    }, [messages]);


    const checkDays = (currentDay: number, prevDay: number | undefined) => {
        if(!prevDay){
            return true;
        } else {
            return currentDay > prevDay;
        }
    }

    return (
        <ChatBlock>
            <ChatTitle>
                {chatName}
            </ChatTitle>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px'}}>
                <MessagesDisplay ref={messagesDisplayRef}> 
                    <NewMessage position={'start'}>
                        <UserBubble>ChatX Bot</UserBubble>
                        <MessageBubble>Hello! I'm the ChatX chatting bot, we can chat about anything! ^^</MessageBubble>
                    </NewMessage>
                    {
                        messages?.map((message, index) => {
                            const position = message.role === 'user' ? 'end' : 'start';
                            const user = message.role === 'user' ? username : 'ChatX Bot';
                            

                            return (
                                <>
                                <NewMessage key={message.id} position={position}>
                                    <UserBubble>{user}</UserBubble>
                                    <MessageBubble>{message.content}</MessageBubble>
                                </NewMessage>
                                </>
                            )
                        })
                    }
                </MessagesDisplay>

                <SendMessageForm onSubmit={handleSubmit}>
                    <MessageInput value={input} placeholder="Message.." 
                    onChange={handleInputChange}
                    ></MessageInput>
                    <SendButton type="submit">Send</SendButton>
                </SendMessageForm>
            </div>
        </ChatBlock>
    )
}
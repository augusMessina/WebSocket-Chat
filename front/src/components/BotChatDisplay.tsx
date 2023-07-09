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
import { motion } from "framer-motion";

export const variants = {
    show: {
      opacity: 1,
      y: 0,
      transition: {
        ease: "easeOut",
        duration: 0.3
      }
    },
    hide: {
      y: 20,
      opacity: 0
    }
  };

export default function BotChatDisplay () {

    const {username, chatName, chatID} = useContext(UserDataContext);

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat'
      })

    const messagesDisplayRef = useRef<HTMLDivElement>(null);


    // cada vez que messageList varíe (se añade un mensaje) hace
    // que el scroll baje
    useEffect(() => {
        if(messagesDisplayRef.current)
            messagesDisplayRef.current.scrollTop = messagesDisplayRef.current.scrollHeight;
    }, [messages, isLoading]);

    return (
        <motion.div
            key={chatID}
            variants={variants}
            initial="hide"
            animate="show"
        >
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
                    { isLoading && messages[messages.length-1].role === 'user' && <span className="writing-loader"></span> }
                </MessagesDisplay>

                <SendMessageForm onSubmit={handleSubmit}>
                    <MessageInput value={input} placeholder="Message.." 
                    onChange={handleInputChange}
                    ></MessageInput>
                    <SendButton type="submit">Send</SendButton>
                </SendMessageForm>
            </div>
        </ChatBlock>
        </motion.div>
    )
}
import useChatData from "@/hooks/useChatData";
import useSendMessage from "@/hooks/useSendMessage";
import { ChatBlock, ChatItem, ChatTitle, MessageBubble, MessageInput, MessagesDisplay, NewMessage, SendButton, SendMessageDiv, UserBubble } from "@/styles/myStyledComponents";
import { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "@/context/UserDataContext";

export default function ChatDisplay () {

    const {chatID, chatName, username} = useContext(UserDataContext);

    const {messages, members} = useChatData(chatID);
    const {sendMessage} = useSendMessage()

    const [message, setMessage] = useState<string>("")

    const messagesDisplayRef = useRef<HTMLDivElement>(null);

    // cada vez que messageList varíe (se añade un mensaje) hace
    // que el scroll baje
    useEffect(() => {
        if(messagesDisplayRef.current)
            messagesDisplayRef.current.scrollTop = messagesDisplayRef.current.scrollHeight;
    }, [messages]);

    const handleSendMessage = () => {
        if(message.trim() !== ''){
            sendMessage(message, chatID);
            setMessage("");
        }
    }


    return (
        <ChatBlock>
            <ChatTitle>{chatName}</ChatTitle>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px'}}>
                <MessagesDisplay ref={messagesDisplayRef}>
                {
                    messages?.map(message => {
                        const position = message.user === username ? 'end' : 'start';
                        const time = new Date(message.timestamp);
                        const hours = time.getHours();
                        const minutes = (time.getMinutes()<10 ? '0' : '') + time.getMinutes();
                        return (
                        <NewMessage key={message?.id} position={position}>
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px'}}>
                                {position==='start' && <UserBubble>{message?.user}</UserBubble>}
                                <p style={{margin: 0}}>{hours}:{minutes}</p>
                            </div>
                            <MessageBubble>{message?.message}</MessageBubble>
                        </NewMessage>
                        )
                    })
                }
                </MessagesDisplay>

                <SendMessageDiv>
                    <MessageInput value={message} placeholder="Message.." 
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter'){
                            handleSendMessage();
                        }
                    }}
                    ></MessageInput>
                    <SendButton onClick={handleSendMessage}>Send</SendButton>
                </SendMessageDiv>
            </div>
        </ChatBlock>
    )
}
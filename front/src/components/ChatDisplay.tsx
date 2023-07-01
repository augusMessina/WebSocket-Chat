import useChatData from "@/hooks/useChatData";
import useSendMessage from "@/hooks/useSendMessage";
import { ChatBlock, MessageBubble, MessageInput, MessagesDisplay, NewMessage, SendButton, SendMessageDiv, UserBubble } from "@/styles/myStyledComponents";
import { useEffect, useRef, useState } from "react";

export default function ChatDisplay (props: {chatID: string, name: string, username: string|undefined}) {

    const {messages, members} = useChatData(props.chatID);
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
            sendMessage(message, props.chatID);
            setMessage("");
        }
    }


    return (
        <ChatBlock>
            {props.name}
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px'}}>
                <MessagesDisplay ref={messagesDisplayRef}>
                {
                    messages?.map(message => {
                        const position = message.user === props.username ? 'end' : 'start';
                        return (
                        <NewMessage key={message?.id} position={position}>
                            <UserBubble>{message?.user}</UserBubble>
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
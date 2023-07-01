import useChatData from "@/hooks/useChatData";
import useSendMessage from "@/hooks/useSendMessage";
import { ChatBlock, MessageBubble, MessageInput, MessagesDisplay, NewMessage, SendButton, SendMessageDiv, UserBubble } from "@/styles/myStyledComponents";
import { useRef, useState } from "react";

export default function ChatDisplay (props: {chatID: string, name: string}) {

    const {messages, members} = useChatData(props.chatID);
    const {sendMessage} = useSendMessage()

    const [message, setMessage] = useState<string>("")

    const messagesDisplayRef = useRef<HTMLDivElement>(null);

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
                    messages?.map(message => (
                        <NewMessage key={message?.id}>
                            <UserBubble>{message?.user}</UserBubble>
                            <MessageBubble>{message?.message}</MessageBubble>
                        </NewMessage>
                    ))
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
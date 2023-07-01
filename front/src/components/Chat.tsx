import useUser from "@/hooks/useUser";
import useUserData from "@/hooks/useUserData";
import { ChatBlock, ErrorMessage, LogoutButton, UserButton, Menu, MenuCentered, MessageBubble, MessageInput, MessagesDisplay, NewMessage, SendButton, SendMessageDiv, UserBubble, Wrapper } from "@/styles/myStyledComponents";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import ChatSelect from "./ChatSelect";
import ChatDisplay from "./ChatDisplay";

const Chat = () => {

    const {logut} = useUser()
    const {username, chats, mailbox} = useUserData()

    const [chatID, setChatID] = useState<string>('');
    const [chatName, setChatName] = useState<string>('');

    return (
        <>
        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '20px', marginRight: '10px'}}>
            <p style={{marginLeft: '225px', marginBottom: 0, marginTop: '0px', fontSize: '40px'}}>Good morning {username}</p>
            <div style={{marginRight: '225px', display: 'flex', gap: '10px'}}>
                <UserButton>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <i className="gg-mail"></i>
                    </div>
                </UserButton>
                <LogoutButton onClick={logut}>Logout</LogoutButton>
            </div>
            
        </div>
        <Wrapper>
        <ChatSelect chats={chats} chatID={chatID} setChatID={setChatID} setChatName={setChatName}/>
        <ChatDisplay chatID={chatID} name={chatName} username={username}></ChatDisplay>
        </Wrapper>
        </>
    );
};

export default Chat;
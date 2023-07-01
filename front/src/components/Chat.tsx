import useUser from "@/hooks/useUser";
import useUserData from "@/hooks/useUserData";
import { ChatBlock, ErrorMessage, LogoutButton, Menu, MenuCentered, MessageBubble, MessageInput, MessagesDisplay, NewMessage, SendButton, SendMessageDiv, UserBubble, Wrapper } from "@/styles/myStyledComponents";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import ChatSelect from "./ChatSelect";
import ChatDisplay from "./ChatDisplay";

type QueryResponse = {
    getMessages: {
        user: string,
        message: string,
        id: string
    }[]
}

type SubRespone = {
    newMessage:{
        user: string,
        message: string,
        id: string
    }
}

const Chat = () => {

    const NEW_MESSAGE_SUBSCRIPTION = gql`
    subscription {
        newMessage {
            user
            message
            id
        }
    }
    `;

    const ADD_MESSAGE_MUTATION = gql`
    mutation AddMessage($token: String!, $message: String!) {
        addMessage(token: $token, message: $message) {
          info
        }
      }
    `;

    const {logut} = useUser()
    const {username, chats, mailbox} = useUserData()

    const [chatID, setChatID] = useState<string>('');
    const [chatName, setChatName] = useState<string>('');

    // const [messageList, setMessageList] = useState<({user:string, message: string, id: string}|undefined)[]>([]);

    // const [message, setMessage] = useState<string>("");

    // const [showError, setShowError] = useState<boolean>(false);

    // const messagesDisplayRef = useRef<HTMLDivElement>(null);

    // // useSubscription para recibir mensajes nuevos, cada vez que llegue uno
    // // se añade a messageList
    // const sub = useSubscription<SubRespone>(NEW_MESSAGE_SUBSCRIPTION,{
    //         onData: (data) => {
    //             console.log("message received");
    //             setMessageList([...messageList, data.data.data?.newMessage]);
    //         }
    // });

    // const [mutationFuntcion] = useMutation(ADD_MESSAGE_MUTATION);

    // const sendMessage = async () => {
    //     await mutationFuntcion({
    //         variables:{
    //             token: JWT,
    //             message
    //         }
    //     });
    //     setMessage("");
    //     setShowError(false);
    // }

    // cada vez que messageList varíe (se añade un mensaje) hace
    // que el scroll baje
    // useEffect(() => {
    //     if(messagesDisplayRef.current)
    //         messagesDisplayRef.current.scrollTop = messagesDisplayRef.current.scrollHeight;
    // }, [messageList]);

    // if (sub.error) {
    //     return <p>Error: {sub.error.message}</p>;
    // }

    return (
        <>
        <div style={{width: '100%', display: 'flex', justifyContent: 'end', marginTop: '10px', marginRight: '10px'}}>
            <LogoutButton onClick={logut}>Logout</LogoutButton>
        </div>
        <Wrapper>
        <ChatSelect chats={chats} chatID={chatID} setChatID={setChatID} setChatName={setChatName}/>
        <ChatDisplay chatID={chatID} name={chatName}></ChatDisplay>
        </Wrapper>
        </>
    );
};

export default Chat;
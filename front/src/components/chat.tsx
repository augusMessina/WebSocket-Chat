import useUser from "@/hooks/useUser";
import { ErrorMessage, LogoutButton, Menu, MessageBubble, MessagesDisplay, NewMessage, SendMessageDiv, UserBubble } from "@/styles/myStyledComponents";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useRef, useState } from "react";

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

    const GET_MESSAGES_QUERY = gql`
    query GetMessages {
        getMessages {
          user
          message
          id
        }
      }  
    `;

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

    const {logut, JWT} = useUser()

    const [messageList, setMessageList] = useState<({user:string, message: string, id: string}|undefined)[]>([]);

    const [message, setMessage] = useState<string>("");

    const [showError, setShowError] = useState<boolean>(false);

    const messagesDisplayRef = useRef<HTMLDivElement>(null);

    // solo hace la query 1 vez, y guarda el resultado obtenido
    // en el estado messageList
    useQuery<QueryResponse>(GET_MESSAGES_QUERY,{
        onCompleted(data) {
            setMessageList(data.getMessages)
        },
    })

    // useSubscription para recibir mensajes nuevos, cada vez que llegue uno
    // se añade a messageList
    const sub = useSubscription<SubRespone>(NEW_MESSAGE_SUBSCRIPTION,{
            onData: (data) => {
                console.log("message received");
                setMessageList([...messageList, data.data.data?.newMessage]);
            }
    });

    const [mutationFuntcion] = useMutation(ADD_MESSAGE_MUTATION);

    const sendMessage = async () => {
        await mutationFuntcion({
            variables:{
                token: JWT,
                message
            }
        });
        setMessage("");
        setShowError(false);
    }

    // cada vez que messageList varíe (se añade un mensaje) hace
    // que el scroll baje
    useEffect(() => {
        if(messagesDisplayRef.current)
            messagesDisplayRef.current.scrollTop = messagesDisplayRef.current.scrollHeight;
    }, [messageList]);

    if (sub.error) {
        return <p>Error: {sub.error.message}</p>;
    }

    return (
        <>
        
        <Menu>
            <div style={{width: '100%', display: 'flex', justifyContent: 'end', marginTop: '10px', marginRight: '10px'}}>
                <LogoutButton onClick={logut}>Logout</LogoutButton>
            </div>
            <h1>Websocket Chat</h1>
            <MessagesDisplay ref={messagesDisplayRef}>
            {
                messageList.map(message => (
                    <NewMessage key={message?.id}>
                        <UserBubble>{message?.user}</UserBubble>
                        <MessageBubble>{message?.message}</MessageBubble>
                    </NewMessage>
                ))
            }
            </MessagesDisplay>

            <SendMessageDiv>
                <input style={{width: "100%"}} value={message} placeholder="Message.." 
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if(e.key === 'Enter'){
                        sendMessage();
                    }
                }}
                ></input>
                <button onClick={sendMessage}>Send</button>
            </SendMessageDiv>

            {
                showError && <ErrorMessage>You must give an user name and a message text</ErrorMessage>
            }
        </Menu>
        
        </>
    );
};

export default Chat;
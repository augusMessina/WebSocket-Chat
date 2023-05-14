import { ErrorMessage, Menu, MessageBubble, MessagesDisplay, NewMessage, UserBubble } from "@/styles/myStyledComponents";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useRef, useState } from "react";

type QueryResponse = {
    getMessages: {
        user: string,
        message: string
    }[]
}

type SubRespone = {
    newMessage:{
        user: string,
        message: string
    }
}

const Chat = () => {

    const GET_MESSAGES_QUERY = gql`
    query GetMessages {
        getMessages {
          user
          message
        }
      }  
    `;

    const NEW_MESSAGE_SUBSCRIPTION = gql`
    subscription {
        newMessage {
            user
            message
        }
    }
    `;

    const ADD_MESSAGE_MUTATION = gql`
    mutation AddMessage($user: String!, $message: String!) {
        addMessage(user: $user, message: $message) {
          info
        }
      }
    `;

    const [messageList, setMessageList] = useState<({user:string, message: string}|undefined)[]>([]);

    const [user, setUser] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const [showError, setShowError] = useState<boolean>(false);

    const messagesDisplayRef = useRef<HTMLDivElement>(null);

    useQuery<QueryResponse>(GET_MESSAGES_QUERY,{
        onCompleted(data) {
            setMessageList(data.getMessages)
        },
    })

    const sub = useSubscription<SubRespone>(NEW_MESSAGE_SUBSCRIPTION,
        {
            onData: (data) => {
                console.log("message received");
                setMessageList([...messageList, data.data.data?.newMessage]);
            }
        });

    const [mutationFuntcion] = useMutation(ADD_MESSAGE_MUTATION);

    const sendMessage = async () => {
        if(user==="" || message===""){
            setShowError(true);
            return;
        }
        await mutationFuntcion({
            variables:{
                user,
                message
            }
        });
        setMessage("");
        setShowError(false);
    }

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
            <h1 style={{color: "white"}}>Messages:</h1>
            <input placeholder="User.." onChange={(e) => setUser(e.target.value)}></input>
            
            <MessagesDisplay ref={messagesDisplayRef}>
            {
                messageList.map(message => (
                    <>
                    <NewMessage>
                        <UserBubble>{message?.user}</UserBubble>
                        <MessageBubble>{message?.message}</MessageBubble>
                    </NewMessage>
                    </>
                ))
            }
            </MessagesDisplay>
            <input value={message} placeholder="Message.." onChange={(e) => setMessage(e.target.value)}></input>
            <button onClick={sendMessage}>Send</button>
            {
                showError && <ErrorMessage>You must give an user name and a message text</ErrorMessage>
            }
        </Menu>
        
        </>
    );
};

export default Chat;
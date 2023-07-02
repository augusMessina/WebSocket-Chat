import styled from "styled-components";

export const Title = styled.p`
    font-size: 60px;
    font-weight: 600;
    margin: 17px;
`;

export const Wrapper = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    gap: 20px;
`;

export const Menu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`;

export const MenuCentered = styled.div`
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 200px;
    background: #00000031;
    backdrop-filter: blur(5px);
    padding: 30px;
    border-radius: 15px;
`;

export const ChatBlock = styled.div`
    margin-bottom: 100px;
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    background: #00000031;
    backdrop-filter: blur(15px);
    padding: 30px;
    border-radius: 15px;
    color: white;
`;

export const FormFlex = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;"
`;

export const EyeIconLabel = styled.label<{backgroundColor: string}>`
    height: 40px; 
    width: 40px;
    cursor: pointer;
    background: ${props => props.backgroundColor};
    border-radius: 50%;
    text-align: center;
    transition: 0.2s;
`;

export const MessagesDisplay = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    height: 600px;
    width: 700px;
    box-shadow: 1px 1px 10px black;
    border-radius: 15px;
    padding: 10px;
    gap: 20px;
    background: #00000043;

    &::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
        background: #f1f1f10;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
        background: #d2d2d24c;
        border-radius: 5px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
        background: #7d7d7d4b;
    } 

`;

export const ChatsDiv = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    height: 660px;
    width: 200px;
    border-radius: 15px;
    padding: 10px;
    gap: 10px;
    background: transparent;

    /* Track */
    &::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
        background: transparent;
    }

`;

export const Mailbox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    overflow-x: hidden;
    height: 300px;
    width: 500px;
    border-radius: 15px;
    padding: 10px;
    gap: 10px;
    background: #1e0d29ec;
    color: white;
    box-shadow: 1px 1px 10px black;
    backdrop-filter: blur(30px);


    /* Track */
    &::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
        background: transparent;
    }
`;

export const NewMessage = styled.div<{position: string}>`
    display: flex;
    flex-direction: column;
    align-items: ${props => props.position};
    gap: 1px;
`;

export const MessageBubble = styled.p`
    width: fit-content;
    margin: 0;
    padding: 7px;
    background: white;
    color: black;
    border-radius: 10px;
    font-weight: 600;
`;

export const UserBubble = styled.p`
    width: fit-content;
    margin: 0;
    padding: 7px;
    background: #145DA0;
    color: white;
    border-radius: 10px;
    font-weight: 600;
`;

export const SendMessageDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 100%;  
`;

export const MailItem = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    gap: 15px;
    padding: 20px;
    border-top: 1px solid #ffffff89;
    border-bottom: 1px solid #ffffff89;
    
    div{
        display: flex;
        flex-direction: row;
        gap: 10px;
    }
`;

export const ErrorMessage = styled.p`
    width: fit-content;
    color: red;
    font-weight: 600;
`;

export const LoginButton = styled.button`
    width: 100px;
    border-radius: 10px;
    background: #8432bb;
    color: white;
    &:hover{
        background: #542074;
    }
`;

export const LogoutButton = styled.button`
    width: 100px;
    border-radius: 10px;
    background: #03010463;
    border-width: 0px;
    color: white;
    &:hover{
        background: #020103aa;
    }
`;

export const UserButton = styled.button`
    width: 60px;
    border-radius: 10px;
    background: #03010463;
    border-width: 0px;
    color: white;
    &:hover{
        background: #020103aa;
    }
`;

export const SendButton = styled.button`
    width: 100px;
    height: 98%;
    border-radius: 10px;
    background: #2b2b2b;
    border-width: 0px;
    color: #757575;
    &:hover{
        background: #00000035;
        color: white;
        border: 1px solid white;
    }
`;

export const LoginInput = styled.input`
    transition: 0.2s;
    border-radius: 10px;
    &:focus{
        padding: 12px;
    }
`;

export const MessageInput = styled.input`
    width: 100%;
    border-radius: 10px;
    background: #2b2b2b;
    color: white;
    &:focus{
        background: #00000035;
    }
`;

export const ChatItem = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    gap: 5px;
    padding: 10px;
    width: 175px;
    border-radius: 10px;
    background: #03010463;
    border-width: 0px;
    color: white;
    transition: 0.2s;
    cursor: pointer;
    &:hover{
        background: #322c34a7;
    };
`;
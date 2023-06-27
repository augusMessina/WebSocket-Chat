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

export const ChatMenu = styled.div`
    margin-bottom: 100px;
    align-self: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    background: #00000031;
    backdrop-filter: blur(5px);
    padding: 30px;
    border-radius: 15px;
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
    overflow-y: hidden;
    overflow-x: hidden;
    height: 700px;
    width: 1000px;
    /* border: 5px solid black; */
    border-radius: 5px;
    padding: 10px;
    gap: 20px;
    background-color: #080156;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23040090' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23004255'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E");
    
    &:hover{
        overflow-y: auto;
    }

    &::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
        background: #f1f1f10;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
        background: #d2d2d2;
        border-radius: 5px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
        background: #001127;
    } 

`;

export const NewMessage = styled.div`
    display: flex;
    flex-direction: column;
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
        background: #0201037f;
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
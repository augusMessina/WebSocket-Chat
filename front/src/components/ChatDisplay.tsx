import useChatData from "@/hooks/useChatData";
import useSendMessage from "@/hooks/useSendMessage";
import { ChatBlock, ChatItem, ChatTitle, DisabledButton, InvitationButton, MessageBubble, MessageInput, MessagesDisplay, NewMessage, PopupContainer, PopupScrollDiv, SendButton, SendMessageDiv, ThreeDotsLabel, UserBubble, UserItem } from "@/styles/myStyledComponents";
import { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "@/context/UserDataContext";
import Popup from "reactjs-popup";
import useSendInvitation from "@/hooks/useSendInvitation";

export default function ChatDisplay () {

    const {chatID, chatName, username, friends, invitSent} = useContext(UserDataContext);

    const {messages, members, setMembers} = useChatData(chatID);
    const {sendMessage} = useSendMessage()

    const [message, setMessage] = useState<string>("")

    const messagesDisplayRef = useRef<HTMLDivElement>(null);

    const {sendInvitation} = useSendInvitation();


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

    const checkMember = (memberName: string, memberId: string, invited: boolean) => {
        return !(memberName === username 
            || friends?.some((friend: any) => friend.username === memberName) 
            || invitSent?.some((sent: any) => sent.id_passed === memberId)
            || invited)
    }

    return (
        <ChatBlock>
            <ChatTitle>
                {chatName}
                <Popup 
                    trigger={<ThreeDotsLabel>
                        <i className="gg-more-vertical-alt"></i>
                    </ThreeDotsLabel>}
                    position={'bottom right'}
                    arrowStyle={{color: '#1E0D29'}}
                    nested
                    >
                        <PopupContainer style={{width: '150px', minHeight: '100px', padding: '10px'}}>
                            <Popup 
                            trigger={<UserItem style={{width: '70%', padding: '0px', cursor: 'pointer'}}>
                                <p>Members</p>
                                <i className="gg-user-list" style={{color: 'white'}}></i>
                            </UserItem>}
                            position={'left top'}
                            on={'hover'}
                            arrow={false}
                            >
                                <PopupScrollDiv style={{width: '450px'}}>
                                    {
                                        members?.map((member) => (
                                            <UserItem key={member.id}>
                                                {member.username}
                                                {
                                                    checkMember(member.username, member.id, member.invited) ?
                                                    <InvitationButton style={{width: '250px'}} onClick={async () => {
                                                        console.log('hey')
                                                        await sendInvitation(member.id, 'FRIEND');
                                                        setMembers(members.map((subMember) => {
                                                            if(member.id === subMember.id){
                                                                return {
                                                                    id: subMember.id,
                                                                    username: subMember.username,
                                                                    invited: true,
                                                                }
                                                            } else {
                                                                return subMember
                                                            }
                                                        }))}}>Send Friend Request</InvitationButton>
                    
                                                    :
                    
                                                    <DisabledButton style={{width: '250px'}}>Send Friend Request</DisabledButton>
                                                }
                                            </UserItem>
                                        ))
                                    }
                                </PopupScrollDiv>
                            </Popup>
                            
                            <UserItem style={{width: '70%', padding: '0px', cursor: 'pointer'}}>
                                <p>Leave</p>
                                <i className="gg-log-in" style={{color: 'white', margin: 0}}></i>
                            </UserItem>
                        </PopupContainer>
                </Popup>
                
            </ChatTitle>
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
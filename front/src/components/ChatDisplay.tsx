import useChatData from "@/hooks/useChatData";
import useSendMessage from "@/hooks/useSendMessage";
import { ChatBlock, ChatItem, ChatTitle, DisabledButton, DisplayBlock, InvitationButton, MessageBubble, MessageInput, MessagesDisplay, NewMessage, PopupContainer, PopupScrollDiv, SendButton, SendMessageForm, ThreeDotsLabel, ThreeLinesLabel, UserBubble, UserItem } from "@/styles/myStyledComponents";
import { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "@/context/UserDataContext";
import Popup from "reactjs-popup";
import useSendInvitation from "@/hooks/useSendInvitation";
import useLeaveChat from "@/hooks/useLeaveChat";
import useRemoveFriend from "@/hooks/useRemoveFriend";
import { motion } from "framer-motion";

export const variants = {
    show: {
      opacity: 1,
      y: 0,
      transition: {
        ease: "easeOut",
        duration: 0.3
      }
    },
    hide: {
      y: 20,
      opacity: 0
    }
  };

export default function ChatDisplay () {

    const {chatID, chatName, username, friends, invitSent} = useContext(UserDataContext);

    const {messages, members, setMembers, modal} = useChatData(chatID);
    const {sendMessage} = useSendMessage()

    const [message, setMessage] = useState<string>("")

    const messagesDisplayRef = useRef<HTMLDivElement>(null);

    const {sendInvitation} = useSendInvitation();
    const {leaveChat} = useLeaveChat()
    const {removeFriend} = useRemoveFriend()


    // cada vez que messageList varíe (se añade un mensaje) hace
    // que el scroll baje
    useEffect(() => {
        if(messagesDisplayRef.current)
            messagesDisplayRef.current.scrollTop = messagesDisplayRef.current.scrollHeight;
    }, [messages]);

    const handleSendMessage = (e: any) => {
        e.preventDefault();
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

    const checkFriend = (friendId: string) => {
        console.log(invitSent)
        return !(invitSent.some((invit: any) => (invit.id_passed === friendId) && (invit?.chatID === chatID)) 
                || members?.some(member => member.id === friendId))
    }

    const checkDays = (currentDay: number, prevDay: number | undefined) => {
        if(!prevDay){
            return true;
        } else {
            return currentDay > prevDay;
        }
    }

    return (
        <motion.div
            key={chatID}
            variants={variants}
            initial="hide"
            animate="show"
        >
        <DisplayBlock>
            <ChatTitle>
                <div style={{display: 'flex', alignItems: 'center', fontSize: '30px', gap: '10px'}}>
                    <ThreeLinesLabel>
                        <i className="gg-menu"></i>
                    </ThreeLinesLabel>
                    {chatName}
                </div>
                
                
                <Popup 
                    trigger={<ThreeDotsLabel>
                        <i className="gg-more-vertical-alt"></i>
                    </ThreeDotsLabel>}
                    position={'bottom right'}
                    arrowStyle={{color: '#1E0D29'}}
                    nested
                    >
                        <PopupContainer style={{width: '175px', minHeight: '100px', padding: '10px'}}>
                            {

                                (modal !== 'FRIEND_CHAT') ?

                                <>
                                <Popup 
                                trigger={
                                <UserItem style={{width: '70%', padding: '0px', cursor: 'pointer'}}>
                                    <p>Members</p>
                                    <i className="gg-user-list" style={{color: 'white'}}></i>
                                </UserItem>
                                }
                                position={'left top'}
                                on={'hover'}
                                arrow={false}
                                >
                                    <PopupScrollDiv style={{maxWidth: '450px'}}>
                                        {
                                            members?.map((member) => (
                                                <UserItem key={member.id}>
                                                    {member.username}
                                                    {
                                                        checkMember(member.username, member.id, member.invited) ?
                                                        <InvitationButton style={{maxWidth: '250px'}} onClick={async () => {
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
                        
                                                        <DisabledButton style={{maxWidth: '250px'}}>Send Friend Request</DisabledButton>
                                                    }
                                                </UserItem>
                                            ))
                                        }
                                    </PopupScrollDiv>
                                </Popup>

                                <Popup 
                                trigger={
                                <UserItem style={{width: '70%', padding: '0px', cursor: 'pointer'}}>
                                    <p>Invite</p>
                                    <i className="gg-user-add" style={{color: 'white'}}></i>
                                </UserItem>
                                }
                                position={'left top'}
                                on={'hover'}
                                arrow={false}
                                >
                                    <PopupScrollDiv style={{maxWidth: '450px'}}>
                                        {
                                            friends?.map((friend: any) => (
                                                <UserItem key={friend.id}>
                                                    {friend.username}
                                                    {
                                                        checkFriend(friend.id) ?
                                                        <InvitationButton style={{maxWidth: '250px'}} onClick={async () => {
                                                            await sendInvitation(friend.id, 'CHAT', chatID);
                                                        }
                                                        }>Send Invitation</InvitationButton>
                        
                                                        :
                        
                                                        <DisabledButton style={{maxWidth: '250px'}}>Send Invitation</DisabledButton>
                                                    }
                                                </UserItem>
                                            ))
                                        }
                                    </PopupScrollDiv>
                                </Popup>
                                
                                <UserItem style={{width: '70%', padding: '0px', cursor: 'pointer'}} onClick={async () => {
                                    await leaveChat(chatID)
                                }}>
                                    <p>Leave</p>
                                    <i className="gg-log-in" style={{color: 'white', margin: 0}}></i>
                                </UserItem>
                                </>

                                :

                                <UserItem style={{width: '90%', padding: '0px', cursor: 'pointer'}} onClick={async () => {
                                    const friendId = members?.find(member => member.username !== username)?.id;
                                    if(friendId){
                                        await removeFriend(friendId)
                                    }
                                        
                                }}>
                                    <p>Remove friend</p>
                                    <i className="gg-log-in" style={{color: 'white', margin: 0}}></i>
                                </UserItem>
                            }
                            
                        </PopupContainer>
                </Popup>
                
            </ChatTitle>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px', width: '100%'}}>
                <MessagesDisplay ref={messagesDisplayRef}>
                {
                    messages?.map((message, index) => {
                        const position = message.user === username ? 'end' : 'start';
                        const time = new Date(message.timestamp);
                        const hours = time.getHours();
                        const minutes = (time.getMinutes()<10 ? '0' : '') + time.getMinutes();
                        const day = time.getDate();
                        const month = time.getMonth()+1;
                        const year = time.getFullYear();
                        const prevTimestamp = messages?.at(index-1)?.timestamp;
                        let prevDay;
                        if(prevTimestamp){
                            prevDay = new Date(prevTimestamp).getDate()
                        }
                        return (
                            <>
                            {
                                (checkDays(day, prevDay) || index===0) && <p style={{alignSelf: 'center'}}>{month}/{day}/{year}</p>
                            }
                            <NewMessage key={message?.id} position={position}>
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px'}}>
                                    {position==='start' && <UserBubble>{message?.user}</UserBubble>}
                                    <p style={{margin: 0}}>{hours}:{minutes}</p>
                                </div>
                                <MessageBubble>{message?.message}</MessageBubble>
                            </NewMessage>
                            </>
                        )
                    })
                }
                </MessagesDisplay>

                <SendMessageForm onSubmit={(e) => handleSendMessage(e)}>
                    <MessageInput value={message} placeholder="Message.." 
                    onChange={(e) => setMessage(e.target.value)}
                    ></MessageInput>
                    <SendButton>Send</SendButton>
                </SendMessageForm>
            </div>
        </DisplayBlock>
        </motion.div>
    )
}
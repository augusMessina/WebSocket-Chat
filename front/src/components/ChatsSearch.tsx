import useGetChats from "@/hooks/useGetChats";
import useJoinChat from "@/hooks/useJoinChat";
import { DisabledButton, InvitationButton, PopupInput, PopupScrollDiv, UserItem } from "@/styles/myStyledComponents";

export default function ChatsSearch () {
    
    const {setSearchName, loading, publicChats, setPublicChats,error, refetch} = useGetChats()

    const {joinChat} = useJoinChat()

    return (
        <>
                <PopupInput placeholder="Enter search name" onChange={(e) => {setSearchName(e.target.value)}}></PopupInput>
                <PopupScrollDiv style={{boxShadow: 'none', gap: '0', width: '100%'}}>
                {
                    publicChats?.map((chat, index) => (
                        <UserItem key={chat.id}>
                            {chat.name}
                            <p style={{fontWeight: 100}}>{chat.members.length} members</p>
                            <div>
                                {
                                    !chat.joined ? 
                                    
                                    <InvitationButton onClick={async () => {
                                        await joinChat(chat.id);
                                        setPublicChats(publicChats.map((subChat, subIndex) => {
                                            if(subIndex === index){
                                                return {
                                                    id: subChat.id,
                                                    name: subChat.name,
                                                    members: subChat.members,
                                                    joined: true,
                                                }
                                          } else {
                                                return subChat;
                                            }
                                        }))
                                    }}>Join</InvitationButton>

                                    :

                                    <DisabledButton>Join</DisabledButton>
                                }
                                
                            </div>
                        </UserItem>
                    ))
                }
                </PopupScrollDiv>
                </> 
    )
}
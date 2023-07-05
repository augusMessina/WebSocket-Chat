import useGetChats from "@/hooks/useGetChats";
import { DisabledButton, InvitationButton, PopupInput, PopupScrollDiv, UserItem } from "@/styles/myStyledComponents";

export default function ChatsSearch () {
    
    const {setSearchName, loading, publicChats, setPublicChats,error, refetch} = useGetChats()

    return (
        <>
                <PopupInput placeholder="Enter search name" onChange={(e) => {setSearchName(e.target.value)}}></PopupInput>
                <PopupScrollDiv style={{boxShadow: 'none', gap: '0', width: '100%'}}>
                {
                    publicChats?.map((chat, index) => (
                        <UserItem key={chat.id}>
                            {chat.name}
                            <div>
                                {
                                    !chat.joined ? 
                                    
                                    <InvitationButton onClick={async () => {
                                        // await sendInvitation(.id, 'FRIEND');
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
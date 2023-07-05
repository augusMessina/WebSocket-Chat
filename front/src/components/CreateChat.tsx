import useSendInvitation from "@/hooks/useSendInvitation";
import useUserData from "@/hooks/useUserData";
import { CreateChatForm, DisabledButton, InvitationButton, NavBar, PopupInput, PopupScrollDiv, UserItem } from "@/styles/myStyledComponents";

export default function CreateChat () {

    const {friends, setFriends} = useUserData()

    const {sendInvitation} = useSendInvitation()

    return (
        <CreateChatForm>
            <p>Name of the group chat:</p>
            <PopupInput style={{margin: 0}} placeholder="Enter new chat name"></PopupInput>
            <p>Invite friends</p>
            <PopupScrollDiv style={{boxShadow: 'none', border: '1px solid grey', height: '150px'}}>
            {
                friends?.map((friend, index) => (
                    <UserItem key={friend.id}>
                        {friend.username}
                        <div>
                            {
                                !friend.invited ? 
                                
                                <InvitationButton onClick={async () => {
                                    await sendInvitation(friend.id, 'CHAT');
                                    setFriends(friends.map((subFriend, subIndex) => {
                                        if(subIndex === index){
                                            return {
                                                id: subFriend.id,
                                                username: subFriend.username,
                                                invited: true,
                                            }
                                        } else {
                                            return subFriend
                                        }
                                    }))
                                }}>Invite</InvitationButton>

                                :

                                <DisabledButton>Invite</DisabledButton>
                            }
                            
                        </div>
                    </UserItem>
                ))
                    }
                    </PopupScrollDiv>

                <NavBar style={{margin: 0, marginTop: '15px'}}>
                    <div style={{display: "flex", alignItems: 'center', gap: '10px'}}>
                    <label className="switch">
                        <input type="checkbox"/>
                        <span className="slider round"></span>
                    </label>
                    <p style={{margin: 0}}>Private</p>
                    </div>
                    
                    <InvitationButton>Create chat</InvitationButton>
                </NavBar>
                </CreateChatForm>
    )
}
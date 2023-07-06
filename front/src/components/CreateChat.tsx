import useCreateChat from "@/hooks/useCreateChat";
import useSendInvitation from "@/hooks/useSendInvitation";
import useUserData from "@/hooks/useUserData";
import { CreateChatForm, DisabledButton, InvitationButton, NavBar, PopupInput, PopupScrollDiv, UserItem } from "@/styles/myStyledComponents";
import { useState } from "react";

export default function CreateChat () {

    const {friends, setFriends} = useUserData()
    const {createChat} = useCreateChat()

    const [pendingInvits, setPendingInvits] = useState<string[]>([])
    const [name, setName] = useState<string>('')
    const [modal, setModal] = useState<string>('PUBLIC');

    const handleSwitch = () => {
        setModal(modal === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC');
    }

    return (
        <CreateChatForm>
            <p>Name of the group chat:</p>
            <PopupInput style={{margin: 0}} placeholder="Enter new chat name" onChange={(e) => {setName(e.target.value)}}></PopupInput>
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
                                    const newInvits = pendingInvits;
                                    newInvits.push(friend.id);
                                    setPendingInvits(newInvits);
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

                                <DisabledButton onClick={() => {
                                    const newInvits = pendingInvits;
                                    newInvits.splice(newInvits.findIndex(friendID => friendID === friend.id), 1);
                                    setFriends(friends.map((subFriend, subIndex) => {
                                        if(subIndex === index){
                                            return {
                                                id: subFriend.id,
                                                username: subFriend.username,
                                                invited: false,
                                            }
                                        } else {
                                            return subFriend
                                        }
                                    }))
                                }} style={{cursor: 'pointer'}}>Invite</DisabledButton>
                            }
                            
                        </div>
                    </UserItem>
                ))
                    }
                    </PopupScrollDiv>

                <NavBar style={{margin: 0, marginTop: '15px'}}>
                    <div style={{display: "flex", alignItems: 'center', gap: '10px'}}>
                    <label className="switch" onChange={handleSwitch}>
                        <input type="checkbox"/>
                        <span className="slider round"></span>
                    </label>
                    <p style={{margin: 0}}>Private</p>
                    </div>
                    
                    <InvitationButton onClick={() => {
                        createChat(name, modal, pendingInvits)
                    }}>Create chat</InvitationButton>
                </NavBar>
                </CreateChatForm>
    )
}
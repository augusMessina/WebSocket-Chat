import useGetUsers from "@/hooks/useGetUsers";
import useSendInvitation from "@/hooks/useSendInvitation";
import { DisabledButton, InvitationButton, LoginButton, MailItem, MessageInput, PopupContainer, PopupInput, PopupScrollDiv, UserItem } from "@/styles/myStyledComponents";
import { useState } from "react";

export default function UsersPopup () {

    const {setSearchName, loading, users, setUsers,error, refetch} = useGetUsers()
    const {sendInvitation} = useSendInvitation();

    return (
        <PopupContainer>
            <PopupInput placeholder="Enter search name" onChange={(e) => {setSearchName(e.target.value)}}></PopupInput>
            <PopupScrollDiv style={{boxShadow: 'none', gap: '0', width: '100%'}}>
            {
                users?.map((user, index) => (
                    <UserItem key={user.id}>
                        {user.username}
                        <div>
                            {
                                !user.invited ? 
                                
                                <InvitationButton onClick={async () => {
                                    await sendInvitation(user.id, 'FRIEND');
                                    setUsers(users.map((subUser, subIndex) => {
                                        if(subIndex === index){
                                            return {
                                                id: subUser.id,
                                                username: subUser.username,
                                                invited: true,
                                            }
                                        } else {
                                            return subUser
                                        }
                                    }))
                                }}>Send Friend Request</InvitationButton>

                                :

                                <DisabledButton>Send Friend Request</DisabledButton>
                            }
                            
                        </div>
                    </UserItem>
                ))
            }
            </PopupScrollDiv>
        </PopupContainer>
    )
}
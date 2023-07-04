import useGetUsers from "@/hooks/useGetUsers";
import useSendInvitation from "@/hooks/useSendInvitation";
import { InvitationButton, LoginButton, MailItem, MessageInput, PopupContainer, PopupInput, PopupScrollDiv, UserItem } from "@/styles/myStyledComponents";
import { useState } from "react";

export default function UsersPopup () {

    const {setSearchName, loading, users, error, refetch} = useGetUsers()
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
                            <InvitationButton onClick={async () => {
                                await sendInvitation(user.id, 'FRIEND');
                                await refetch()
                            }}>Send Friend Request</InvitationButton>
                        </div>
                    </UserItem>
                ))
            }
            </PopupScrollDiv>
        </PopupContainer>
    )
}
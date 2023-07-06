import useRespondMail from "@/hooks/useRespondMail";
import { LoginButton, LogoutButton, MailItem, PopupScrollDiv, UserButton } from "@/styles/myStyledComponents";
import { useContext, useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { UserDataContext } from "@/context/UserDataContext";

export default function Topbar () {


    const {username, mailbox, logoutFunction, refetchData} = useContext(UserDataContext);

    const {accept, decline} = useRespondMail(refetchData)

    const [timeText, setTimeText] = useState<string>('');

    useEffect(() => {
        const now = new Date();
        if(now.getHours() >= 5 && now.getHours() < 12) {
            setTimeText('Good morning');
        } else if (now.getHours() <= 18 && now.getHours() >= 12) {
            setTimeText('Good afternoon');
        } else {
            setTimeText('Good evening');
        }
    }, [])

    const handleAccept = async (invitID: string) => {
        await accept(invitID)
    }

    const handleDecline = async (invitID: string) => {
        await decline(invitID)
    }

    return (
        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '20px', marginRight: '10px'}}>
            <p style={{marginLeft: '225px', marginBottom: 0, marginTop: '0px', fontSize: '40px'}}>{timeText} {username}</p>
            <div style={{marginRight: '225px', display: 'flex', gap: '10px'}}>
                <Popup arrowStyle={{color: '#1E0D29'}} onOpen={async () => {await refetchData()}} trigger={
                    <UserButton>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <i className="gg-mail"></i>
                        </div>
                    </UserButton>
                } position={'bottom center'}>
                    <PopupScrollDiv>
                        {
                            mailbox?.length === 0 && <p>Your friend requests and chat invitations will arrive here</p>
                        }
                        {
                            mailbox?.map((request: any) => {
                                const modal = request.modal === 'FRIEND' ? 'Friend request from' : 'Chat invitation to';
                                return (
                                    <MailItem key={request.id_passed}>
                                        {modal} {request.name}
                                        <div>
                                            <LoginButton onClick={() => handleAccept(request.id_passed)}>Accept</LoginButton>
                                            <LogoutButton onClick={() => handleDecline(request.id_passed)}>Decline</LogoutButton>
                                        </div>
                                    </MailItem>
                                )
                            })
                        }
                    </PopupScrollDiv>
                </Popup>
                
                <LogoutButton onClick={logoutFunction}>Logout</LogoutButton>
            </div>
            
        </div>
    )
}
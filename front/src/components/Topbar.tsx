import useRespondMail from "@/hooks/useRespondMail";
import { LoginButton, LogoutButton, MailItem, Mailbox, UserButton } from "@/styles/myStyledComponents";
import { useEffect, useState } from "react";
import Popup from "reactjs-popup";

export default function Topbar (props: {username: string|undefined, logoutFunction: () => void, refetchFunction: any, mailbox: {
    id_passed: string;
    modal: string;
    name: string;
}[] | undefined}) {

    const {username, mailbox, logoutFunction, refetchFunction} = props;

    const {accept, decline} = useRespondMail(refetchFunction)

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
                <Popup arrowStyle={{color: '#1E0D29'}} trigger={
                    <UserButton>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <i className="gg-mail"></i>
                        </div>
                    </UserButton>
                } position={'bottom center'}>
                    <Mailbox>
                        {
                            mailbox?.length === 0 && <p>Nothing to see here..</p>
                        }
                        {
                            mailbox?.map(request => {
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
                    </Mailbox>
                </Popup>
                
                <LogoutButton onClick={logoutFunction}>Logout</LogoutButton>
            </div>
            
        </div>
    )
}
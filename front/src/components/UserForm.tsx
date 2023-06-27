import useUser from "@/hooks/useUser";
import { ErrorMessage, EyeIconLabel, FormFlex, LoginButton, LoginInput } from "@/styles/myStyledComponents";
import { useContext, useState } from "react";
import { Context } from "@/context/CredentialsContext";
import { LoginContext } from "./Login";

export default function UserForm () {

    // get context from login (mutation) and from FormContext (credentials)
    const {username, password, setUsername, setPassword} = useContext(Context)
    const {mutationFuntcion, loading, error} = useContext(LoginContext)

    // States for icons
    const [eyeClass, setEyeClass] = useState<{class: string, color: string, background: string}>({
        class:"gg-eye", 
        color: 'white', 
        background: 'transparent'});
    const [inputType, setInputType] = useState<string>("password");

    // save JWT
    const {login} = useUser()

    // Icon managing
    const swapVisibility = () => {
        if (eyeClass.class === "gg-eye") {
            setInputType("text");
            setEyeClass({class:"gg-eye-alt", color: '#8432bb', background: '#5420746f'});
        } else {
            setInputType("password");
            setEyeClass({class:"gg-eye", color: 'white', background: 'transparent'});
        }
    }

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try{
            const response = await mutationFuntcion({variables: {
                username,
                password
            }});
            if (response && response.data) {
                login(response.data.login);
            }
        } catch (e){
            console.log((e as Error).message)
        }
    }

    return (
        <FormFlex onSubmit={handleSubmit}>
            <LoginInput type="text" placeholder="User name" style={{alignSelf: 'end'}} 
            onChange={(e) => {setUsername(e.target.value)}}></LoginInput>

            <div style={{display: "flex", flexDirection:"row", alignItems:"center", gap: "5px", width: "100%"}}>

                <EyeIconLabel style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} 
                backgroundColor={eyeClass.background} onClick={swapVisibility}>

                    <i className={eyeClass.class} style={{color: eyeClass.color}}></i>

                </EyeIconLabel>

                <LoginInput type={inputType} placeholder="Password"
                onChange={(e) => {setPassword(e.target.value)}}></LoginInput>

            </div>
            {error && <ErrorMessage>Wrong username or password</ErrorMessage>}
            {!loading ? <LoginButton>Log in</LoginButton> : <div className="custom-loader"></div>}

        </FormFlex> 
    )
}
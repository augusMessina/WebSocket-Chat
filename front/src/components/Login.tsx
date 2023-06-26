import useUser from "@/hooks/useUser";
import { ErrorMessage, EyeIconLabel, LoginButton, LoginInput, MenuCentered, Title, FormFlex, Wrapper } from "@/styles/myStyledComponents"
import { gql, useMutation } from "@apollo/client";
import Link from "next/link"
import { useState } from "react"

const LOGIN_MUTATION = gql`
mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

export default function Login () {
    // States
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [eyeClass, setEyeClass] = useState<{class: string, color: string, background: string}>({
        class:"gg-eye", 
        color: 'white', 
        background: 'transparent'});
    const [inputType, setInputType] = useState<string>("password");

    const {login} = useUser()

    // Mutation

    const [mutationFuntcion, {loading, error}] = useMutation(LOGIN_MUTATION);

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
        <>
        <Wrapper>
            <MenuCentered>
                <Title>Welcome to ChatX</Title>
                <FormFlex onSubmit={handleSubmit}>
                    <LoginInput type="text" placeholder="User name" style={{alignSelf: 'end'}} 
                    onChange={(e) => {setUsername(e.target.value)}}></LoginInput>
                    <div style={{display: "flex", flexDirection:"row", alignItems:"center", gap: "5px", width: "100%"}}>
                        <EyeIconLabel style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} backgroundColor={eyeClass.background} onClick={swapVisibility}>
                            <i className={eyeClass.class} style={{color: eyeClass.color}}></i>
                        </EyeIconLabel>
                        <LoginInput type={inputType} placeholder="Password"
                        onChange={(e) => {setPassword(e.target.value)}}></LoginInput>
                    </div>
                    {error && <ErrorMessage>Wrong username or password</ErrorMessage>}
                    {!loading ? <LoginButton>Log in</LoginButton> : <div className="custom-loader"></div>}

                </FormFlex>
                <p style={{fontWeight: "600"}}>You don't have an account yet? <Link className="link" href={'/'}>Create account</Link></p>
            </MenuCentered>
        </Wrapper>
        </>
    )
}
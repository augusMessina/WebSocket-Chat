import Signup from "@/components/Signup"
import CredentialsContextProvider from "@/context/CredentialsContext"


const SignupPage = () => {
    return (
        <CredentialsContextProvider>
            <Signup></Signup>
        </CredentialsContextProvider>
    )
    
}

export default SignupPage
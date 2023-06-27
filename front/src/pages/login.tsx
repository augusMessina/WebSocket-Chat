import Login from "@/components/Login"
import CredentialsContextProvider from "@/context/CredentialsContext"


const LoginPage = () => {
    return(
        <CredentialsContextProvider>
            <Login></Login>
        </CredentialsContextProvider>
    )
    
}

export default LoginPage
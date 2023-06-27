import { createContext, useState } from "react";

type CredentialsContextProviderProps = {
    children: React.ReactNode;
  }

export const CredentialsContext = createContext<any>({})

export default function CredentialsContextProvider(props: CredentialsContextProviderProps) {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    return (
        <CredentialsContext.Provider value={{username, setUsername, password, setPassword}}>
            {props.children}
        </CredentialsContext.Provider>
    )
}
import { createContext, useState } from "react";

export const Context = createContext<any>({})

export default function CredentialsContextProvider({children}) {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    return (
        <Context.Provider value={{username, setUsername, password, setPassword}}>
            {children}
        </Context.Provider>
    )
}
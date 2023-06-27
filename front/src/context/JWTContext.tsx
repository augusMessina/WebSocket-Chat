import { createContext, useEffect, useState } from "react";

export const Context = createContext<any>({})

export default function JWTContextProvider({children}) {
    const [JWT, setJWT] = useState<string | null>(null)

    useEffect(() => {
        const storedJWT = window.localStorage.getItem("JWT");
        if (storedJWT) {
          setJWT(storedJWT);
        }
      }, []);

    return (
        <Context.Provider value={{JWT, setJWT}}>
            {children}
        </Context.Provider>
    )
}
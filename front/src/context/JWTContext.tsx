import { createContext, useEffect, useState } from "react";

type JWTContextProviderProps = {
  children: React.ReactNode;
}

export const JWTContext = createContext<any>({})

export default function JWTContextProvider(props: JWTContextProviderProps) {
    const [JWT, setJWT] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedJWT = window.localStorage.getItem("JWT");
        if (storedJWT) {
          setJWT(storedJWT);
        }
        setIsLoading(false)
      }, []);

    return (
        <JWTContext.Provider value={{JWT, setJWT, isLoading}}>
            {props.children}
        </JWTContext.Provider>
    )
}
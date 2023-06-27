import { DocumentNode, useMutation } from "@apollo/client";
import { createContext } from "react";

type MutationContextProviderProps = {
    MUTATION: DocumentNode;
    pageType: string;
    children: React.ReactNode;
}

export const MutationContext = createContext<any>({})

export default function MutationContextProvider(props: MutationContextProviderProps) {
    const [mutationFuntcion, {loading, error}] = useMutation(props.MUTATION);
    

    return (
        <MutationContext.Provider value={{mutationFuntcion, loading, error, pageType: props.pageType}}>
            {props.children}
        </MutationContext.Provider>
    )
}
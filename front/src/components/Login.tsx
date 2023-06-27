import useUser from "@/hooks/useUser";
import { ErrorMessage, EyeIconLabel, LoginButton, LoginInput, MenuCentered, Title, FormFlex, Wrapper } from "@/styles/myStyledComponents"
import { gql, useMutation } from "@apollo/client";
import Link from "next/link"
import { createContext, useState } from "react"
import UserForm from "./UserForm";

const LOGIN_MUTATION = gql`
mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

export const LoginContext = createContext<any>({});

export default function Login () {

    // generate objects for context for form
    const [mutationFuntcion, {loading, error}] = useMutation(LOGIN_MUTATION);

    return (
        <>
        <Wrapper>
            <MenuCentered>
                <Title>Welcome to ChatX</Title>
                <LoginContext.Provider value={{mutationFuntcion, loading, error}}>
                    <UserForm></UserForm>
                </LoginContext.Provider>
                <p style={{fontWeight: "600"}}>You don't have an account yet? <Link className="link" href={'/'}>Create account</Link></p>
            </MenuCentered>
        </Wrapper>
        </>
    )
}
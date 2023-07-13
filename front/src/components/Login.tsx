import useUser from "@/hooks/useUser";
import { ErrorMessage, EyeIconLabel, LoginButton, LoginInput, MenuCentered, Title, FormFlex, BlocksWrapper } from "@/styles/myStyledComponents"
import { gql, useMutation } from "@apollo/client";
import Link from "next/link"
import { createContext, useState } from "react"
import UserForm from "./UserForm";
import MutationContextProvider from "@/context/MutationContext";

const LOGIN_MUTATION = gql`
mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

export default function Login () {

    // generate objects for context for form

    return (
        <>
        <BlocksWrapper>
            <MenuCentered>
                <Title>Welcome to ChatX</Title>
                <MutationContextProvider MUTATION={LOGIN_MUTATION} pageType={'LOGIN'}>
                    <UserForm></UserForm>
                </MutationContextProvider>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: '600'}}>
                    <p>Don't have an account yet?</p>
                    <Link className="link" href={'/signup'}>Create account</Link>
                </div>
                
            </MenuCentered>
        </BlocksWrapper>
        </>
    )
}
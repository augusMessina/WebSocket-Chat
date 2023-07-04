import useUser from "@/hooks/useUser";
import { ErrorMessage, EyeIconLabel, LoginButton, LoginInput, MenuCentered, Title, FormFlex, Wrapper } from "@/styles/myStyledComponents"
import { gql, useMutation } from "@apollo/client";
import Link from "next/link"
import { createContext, useState } from "react"
import UserForm from "./UserForm";
import MutationContextProvider from "@/context/MutationContext";

const REGISTER_MUTATION = gql`
mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password)
  }
`;

export default function Signup () {

    // generate objects for context for form

    return (
        <>
        <Wrapper>
            <MenuCentered>
                <Title>Create your <br></br> ChatX account</Title>
                <MutationContextProvider MUTATION={REGISTER_MUTATION} pageType="SIGNUP">
                    <UserForm></UserForm>
                </MutationContextProvider>
            </MenuCentered>
        </Wrapper>
        </>
    )
}
import { JWTContext } from "@/context/JWTContext";
import { gql, useQuery } from "@apollo/client";
import { useCallback, useContext } from "react";

type QueryResponse = {
  validateJWT: string;
};

const VALIDATE_JWT = gql`
  query Query($token: String!) {
    getUserData(token: $token) {
      username
    }
  }
`;

export default function useUser() {
  const { JWT, setJWT, isLoading } = useContext(JWTContext);

  const { error } = useQuery<QueryResponse>(VALIDATE_JWT, {
    variables: {
      token: JWT,
    },
  });

  const login = useCallback(
    (JWT: string) => {
      setJWT(JWT);
      window.localStorage.setItem("JWT", JWT);
    },
    [setJWT]
  );

  const logut = useCallback(() => {
    setJWT(null);
    window.localStorage.removeItem("JWT");
  }, [setJWT]);

  return {
    isLogged: Boolean(JWT),
    isLoading,
    isValid: !error,
    login,
    logut,
    JWT,
  };
}

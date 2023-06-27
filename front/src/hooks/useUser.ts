import { Context } from "@/context/JWTContext";
import { useCallback, useContext } from "react";

export default function useUser() {
  const { JWT, setJWT } = useContext(Context);

  const login = useCallback(
    (JWT: string) => {
      setJWT(JWT);
      window.localStorage.setItem("JWT", JWT);
    },
    [setJWT]
  );

  return {
    isLogged: Boolean(JWT),
    login,
  };
}

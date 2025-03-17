import { LoginRequest } from "@/types/auth";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { AuthContext } from "./auth-context";
import useLogin from "@/hooks/use-login";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessTokenCookies, setAccessTokenCookies] = useCookies([
    "accessToken",
  ]);
  const [refreshTokenCookies, setRefreshTokenCookies] = useCookies([
    "refreshToken",
  ]);
  const [name, setName] = useState("");
  const { mutate: loginMutation, isSuccess, isError, error, data } = useLogin();
  const login = async (userData: LoginRequest) => {
    loginMutation(userData);
    if (isSuccess) {
      setIsAuthenticated(true);
      setAccessTokenCookies("accessToken", data.access);
      setRefreshTokenCookies("refreshToken", data.refresh);
      setName(data.name);
    }
    if (isError) {
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccessTokenCookies("accessToken", "");
    setRefreshTokenCookies("refreshToken", "");
    setName("");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        accessToken: accessTokenCookies.accessToken,
        refreshToken: refreshTokenCookies.refreshToken,
        name,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

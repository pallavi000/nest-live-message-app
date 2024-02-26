import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import { TAuthContextStates } from "../@types/context";
import { TUser } from "../@types/user";
import { useLocalStorage } from "../hooks/useLocalStorage";
import AppLoader from "../component/AppLoader";

const initialState: TAuthContextStates = {
  token: "",
  setToken: () => {},
  logout: () => {},
  user: null,
};

export const AuthContext = createContext(initialState);

export const useAuthContext = () => useContext(AuthContext);

function AuthContextProvider({ children }: React.PropsWithChildren) {
  const [isAppReady, setIsAppReady] = useState(false);
  const [user, setUser] = useState<TUser | null>(null);
  const [token, setToken] = useLocalStorage("token", "");

  const getCurrentUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/profile");

      setUser(response.data);
    } catch (error) {
      //console.log(error.message);
    }
    setIsAppReady(true);
  };

  useEffect(() => {
    if (token) {
      getCurrentUser();
    } else {
      setIsAppReady(true);
    }
  }, [token]);

  const logout = () => {
    setToken("");
    window.location.href = "/sign-in";
  };

  if (!isAppReady) return <AppLoader />;

  return (
    <AuthContext.Provider value={{ token, setToken, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useApi from "../utils/useApi.hook";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [open, setOpen] = useState({
    signIn: false,
    signUp: false,
    forgotPassword: false,
  });

  const loginApi = useApi({ url: "/auth/login", method: "post" });
  const registerApi = useApi({ url: "/auth/register", method: "post" });
  const forgotPasswordApi = useApi({
    url: "/auth/forgotpassword",
    method: "post",
  });
  const userApi = useApi({ url: "/users/me", method: "get" });

  const fetchUser = async () => {
    const response = await userApi.call();
    if (response.ok) {
      setUser(response.data);
    }
  };

  const openSignIn = () => {
    setOpen((open) => ({ ...open, signIn: true }));
  };
  const closeSignIn = () => {
    setOpen((open) => ({ ...open, signIn: false }));
  };

  const openSignUp = () => {
    setOpen((open) => ({ ...open, signUp: true }));
  };
  const closeSignUp = () => {
    setOpen((open) => ({ ...open, signUp: false }));
  };

  const openForgotPassword = () => {
    setOpen((open) => ({ ...open, forgotPassword: true }));
  };
  const closeForgotPassword = () => {
    setOpen((open) => ({ ...open, forgotPassword: false }));
  };

  const signIn = async (data) => {
    const response = await loginApi.call({ data });

    if (response.ok) {
      localStorage.setItem("token", response.data.token);
      await fetchUser();
      closeSignIn();
    }

    return response;
  };

  const signUp = async (data) => {
    const response = await registerApi.call({ data });

    if (response.ok) {
      localStorage.setItem("token", response.data.token);
      await fetchUser();
      closeSignUp();
    }

    return response;
  };

  const forgotPassword = async (data) => {
    const response = await forgotPasswordApi.call({ data });

    if (response.ok) {
      closeForgotPassword();
    }

    return response;
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        open,
        user,
        openSignIn,
        closeSignIn,
        openSignUp,
        closeSignUp,
        openForgotPassword,
        closeForgotPassword,
        signIn,
        signOut,
        forgotPassword,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

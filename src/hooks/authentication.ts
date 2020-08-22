import { useCallback, useContext, useEffect, useState } from "react";

import {
  isLoggedIn,
  login as doLogin,
  logout as doLogout,
} from "../model/authentication";
import { LanguageContext } from "../resources/language";
import { toast } from "../util/toast";

export const useLogin = () => {
  const { LOGIN } = useContext(LanguageContext);

  const [isLoggedIn, setIsLoggedIn] = useState(() => isLoggedIn());

  const login = useCallback(
    (email: string, pw: string) =>
      doLogin(email, pw)
        .then(() => {
          setIsLoggedIn(true);
          return true;
        })
        .catch((err) => {
          console.error("Error while logging in:", err);
          const message =
            err.status === 401
              ? LOGIN.ALERT.WRONG_USERDATA
              : LOGIN.ALERT.NO_SERVER_RESPONSE;
          toast(message, { type: "error" });
          return false;
        }),
    [LOGIN],
  );

  const logout = async () => {
    setIsLoggedIn(false);
    await doLogout();
  };

  useEffect(() => {
    const updateLoggedInStatus = () => setIsLoggedIn(isLoggedIn());
    window.addEventListener("storage", updateLoggedInStatus);
    return () => window.removeEventListener("storage", updateLoggedInStatus);
  }, [isLoggedIn]);

  return {
    isLoggedIn,
    login,
    logout,
  };
};

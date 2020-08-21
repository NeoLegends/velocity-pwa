import { useCallback, useContext, useState } from "react";

import {
  hasTokens,
  login as doLogin,
  logout as doLogout,
} from "../model/authentication";
import { LanguageContext } from "../resources/language";
import { toast } from "../util/toast";

export const useLogin = () => {
  const { LOGIN } = useContext(LanguageContext);

  const [isLoggedIn, setIsLoggedIn] = useState(() => hasTokens());
  const [loginStatusKnown, setStatusKnown] = useState(false);

  const login = useCallback(
    (email: string, pw: string) =>
      doLogin(email, pw)
        .then(() => {
          setIsLoggedIn(true);
          setStatusKnown(true);
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

  const logout = () => {
    setIsLoggedIn(false);
    setStatusKnown(true);
    doLogout().then(() => {});
  };

  return {
    isLoggedIn,
    login,
    loginStatusKnown,
    logout,
  };
};

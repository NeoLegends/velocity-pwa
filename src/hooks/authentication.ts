import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
  isLoggedIn as checkIsLoggedIn,
  login as doLogin,
  logout as doLogout,
} from '../model/authentication';
import { LanguageContext } from '../resources/language';

export const useLogin = () => {
  const { LOGIN } = useContext(LanguageContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginStatusKnown, setStatusKnown] = useState(false);

  useEffect(() => {
    checkIsLoggedIn()
      .then(isIn => {
        setIsLoggedIn(isIn);
        setStatusKnown(true);
      })
      .catch(err => {
        console.error("Error while checking for login state:", err);
        toast(LOGIN.ALERT.NO_SERVER_RESPONSE, { type: 'error' });
      });
  }, []);

  const login = (email: string, pw: string) =>
    doLogin(email, pw)
      .then(() => {
        setIsLoggedIn(true);
        setStatusKnown(true);
        return true;
      })
      .catch(err => {
        console.error("Error while logging in:", err);
        const message = err.status === 401
          ? LOGIN.ALERT.WRONG_USERDATA
          : LOGIN.ALERT.NO_SERVER_RESPONSE;
        toast(message, { type: 'error' });
        return false;
      });

  const logout = () =>
    doLogout()
      .then(() => {
        setIsLoggedIn(false);
        setStatusKnown(true);
      })
      .catch(err => {
        console.error("Error while logging out:", err);
        toast(LOGIN.ALERT.LOGOUT_ERR, { type: 'error' });
      });

  const loginCallback = useCallback(login, [LOGIN]);
  const logoutCallback = useCallback(logout, [LOGIN]);

  return {
    isLoggedIn,
    login: loginCallback,
    loginStatusKnown,
    logout: logoutCallback,
  };
};

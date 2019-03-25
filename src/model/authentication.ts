import { fetchWithRetry } from './fetch';
import { eraseCardPin } from './pin';
import {
  API_IS_AUTHENTICATED_URL,
  API_LOGIN_URL,
  API_LOGOUT_URL,
} from './urls';

export interface ApiError {
  error: string;
  message: string;
  path: string;
  status: number;
  timestamp: number;
}

/** Determines if the user is logged in. */
export const isLoggedIn = async () => {
  const resp = await fetchWithRetry(
    API_IS_AUTHENTICATED_URL,
    { credentials: 'include' },
    25,
  );
  return resp.ok ? !!(await resp.text()) : false;
};

/**
 * Attempts to log in the user.
 *
 * In case of an error, throws the deserialized JSON response.
 *
 * @param email the user's email
 * @param password the user's password
 */
export const login = async (email: string, password: string) => {
  const data = new FormData();
  data.append('j_username', email);
  data.append('j_password', password);
  data.append('_spring_security_remember_me', 'true');
  data.append('submit', 'Login');

  const resp = await fetchWithRetry(API_LOGIN_URL, {
    body: data,
    credentials: 'include',
    method: 'POST',
  });

  if (!resp.ok) {
    throw await resp.json();
  }
};

/** Logs out the user. */
export const logout = () => fetchWithRetry(API_LOGOUT_URL).then(eraseCardPin);

import { fetchWithRetry } from './fetch';
import { eraseCardPin } from './pin';
import { API_IS_AUTHENTICATED_URL, API_LOGIN_URL, API_LOGOUT_URL } from './urls';

export interface ApiError {
  error: string;
  message: string;
  path: string;
  status: number;
  timestamp: number;
}

export const isLoggedIn = async () => {
  const resp = await fetchWithRetry(
    API_IS_AUTHENTICATED_URL,
    { credentials: 'include' },
    25,
  );
  return resp.ok ? !!(await resp.text()) : false;
};

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

export const logout = () => fetchWithRetry(API_LOGOUT_URL).then(eraseCardPin);

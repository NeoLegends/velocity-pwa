import { API_AUTHENTICATION_URL, API_LOGOUT_URL } from './urls';

export interface ApiError {
  error: string;
  message: string;
  path: string;
  status: number;
  timestamp: number;
}

export const isLoggedIn = async () => {
  const resp = await fetch(API_AUTHENTICATION_URL);
  return resp.ok ? !!(await resp.text()) : false;
};

export const login = async (email: string, password: string) => {
  const data = new FormData();
  data.append('j_username', email);
  data.append('j_password', password);
  data.append('_spring_security_remember_me', 'true');
  data.append('submit', 'Login');

  const resp = await fetch(API_AUTHENTICATION_URL, {
    body: data,
    method: 'POST',
  });

  if (!resp.ok) {
    throw await resp.json();
  }
};

export const logout = () => fetch(API_LOGOUT_URL).then(() => {});

import { fetchWithRetry, postJsonEnsureOk } from "./fetch";
import { eraseCardPin } from "./pin";
import { JWT_LOGIN_REFRESH, JWT_LOGIN_URL, JWT_LOGOUT_URL } from "./urls";

export interface ApiError {
  error: string;
  message: string;
  path: string;
  status: number;
  timestamp: number;
}

export interface AppJwtResponse {
  jwt: string;
  refreshToken: string;
}

export const LOCALSTORAGE_KEY_JWT = "login/jwt";
export const LOCALSTORAGE_KEY_REFRESH = "login/refreshToken";

export const hasTokens = () =>
  localStorage.getItem(LOCALSTORAGE_KEY_JWT) !== null;

/** Stores AppJwtResponse to localStorage */
export const persistTokens = ({ jwt, refreshToken }: AppJwtResponse) => {
  localStorage.setItem(LOCALSTORAGE_KEY_JWT, jwt);
  localStorage.setItem(LOCALSTORAGE_KEY_REFRESH, refreshToken);
};

/** Determines if there's an active JWT token stored locally */
export const removeTokens = () => {
  localStorage.removeItem(LOCALSTORAGE_KEY_JWT);
  localStorage.removeItem(LOCALSTORAGE_KEY_REFRESH);
};

export const getBearerHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem(LOCALSTORAGE_KEY_JWT)}`,
});

/**
 * Attempts to log in the user.
 *
 * In case of an error, throws the deserialized JSON response.
 *
 * @param email the user's email
 * @param password the user's password
 */
export const login = async (email: string, password: string) => {
  const resp = await fetchWithRetry(JWT_LOGIN_URL, {
    body: JSON.stringify({
      username: email,
      password,
    }),
  });

  const json = await resp.json();

  if (!resp.ok) {
    throw json;
  }

  persistTokens(json);
};

/** Logs out the user. */
export const logout = () =>
  postJsonEnsureOk(
    JWT_LOGOUT_URL,
    {
      refreshToken: localStorage.getItem(LOCALSTORAGE_KEY_REFRESH),
    },
    "post",
    5,
    getBearerHeader(),
  )
    .then(removeTokens)
    .then(eraseCardPin);

export const refreshJwt = () =>
  postJsonEnsureOk(JWT_LOGIN_REFRESH, {
    refreshToken: localStorage.getItem(LOCALSTORAGE_KEY_REFRESH),
  })
    .then((res) => res.json())
    .then(persistTokens);

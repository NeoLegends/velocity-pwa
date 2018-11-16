import { InvalidStatusCodeError } from '.';

export const fetch404ToNull = async (url: string, init?: RequestInit) => {
  const resp = await fetch(url, {
    ...init,
    credentials: 'include',
  });

  if (!resp.ok) {
    if (resp.status === 404) {
      return null;
    }

    throw new InvalidStatusCodeError(resp.status, url);
  }

  return resp.json();
};

export const fetchEnsureOk = async (url: string, init?: RequestInit) => {
  const resp = await fetch(url, {
    ...init,
    credentials: 'include',
  });

  if (!resp.ok) {
    throw new InvalidStatusCodeError(resp.status, url);
  }

  return resp.json();
};

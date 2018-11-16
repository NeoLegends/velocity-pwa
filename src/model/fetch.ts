import { InvalidStatusCodeError } from '.';

export const fetch404ToNull = async (url: string, init?: RequestInit) => {
  const resp = await fetch(url);

  if (!resp.ok) {
    if (resp.status === 404) {
      return null;
    }

    throw new InvalidStatusCodeError(resp.status, url);
  }

  return resp.json();
};

export const fetchEnsureOk = async (url: string, init?: RequestInit) => {
  const resp = await fetch(url, init);

  if (!resp.ok) {
    throw new InvalidStatusCodeError(resp.status, url);
  }

  return resp.json();
};

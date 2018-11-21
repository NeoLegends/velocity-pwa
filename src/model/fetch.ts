import { InvalidStatusCodeError } from '.';

const fetchStatusToNull = (nullStatus: number) => async (url: string, init?: RequestInit) => {
  const resp = await fetch(url, {
    ...init,
    credentials: 'include',
  });

  if (resp.status === nullStatus) {
    return null;
  }
  if (!resp.ok) {
    throw new InvalidStatusCodeError(resp.status, url);
  }

  return resp.json();
};

export const fetch204ToNull = fetchStatusToNull(204);

export const fetch404ToNull = fetchStatusToNull(404);

export const fetchEnsureOk = async (url: string, init?: RequestInit) => {
  const resp = await fetch(url, {
    ...init,
    credentials: 'include',
  });

  if (!resp.ok) {
    throw new InvalidStatusCodeError(resp.status, url);
  }

  return resp;
};

export const fetchJsonEnsureOk = (url: string, init?: RequestInit) =>
  fetchEnsureOk(url, init).then(resp => resp.json());

export const postJsonEnsureOk = (url: string, body?: unknown, method: string = 'post') =>
  fetchEnsureOk(url, {
    body: body ? JSON.stringify(body) : undefined,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    method,
  });

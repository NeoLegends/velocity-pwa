import { InvalidStatusCodeError } from '.';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchWithRetry = async (
  url: string,
  init?: RequestInit,
  maxRetry: number = 5,
) => {
  if (maxRetry < 1) {
    throw new Error("maxRetry must be > 0");
  }

  let err;

  for (let i = 0; i < maxRetry; i++) {
    try {
      return await fetch(url, init);
    } catch (e) {
      err = e;
      await delay(isFinite(i) ? i * 500 : 500);
    }
  }

  throw err;
};

const fetchStatusToNull = (nullStatus: number) =>
  async (url: string, init?: RequestInit, maxRetry: number = 5) => {
    const resp = await fetchWithRetry(url, {
      ...init,
      credentials: 'include',
    }, maxRetry);

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

export const fetchEnsureOk = async (url: string, init?: RequestInit, maxRetry: number = 5) => {
  const resp = await fetchWithRetry(url, {
    ...init,
    credentials: 'include',
  }, maxRetry);

  if (!resp.ok) {
    throw new InvalidStatusCodeError(resp.status, url);
  }

  return resp;
};

export const fetchJsonEnsureOk = (
  url: string,
  init?: RequestInit,
  maxRetry: number = 5,
) =>
  fetchEnsureOk(url, init, maxRetry).then(resp => resp.json());

export const postJsonEnsureOk = (
  url: string,
  body?: unknown,
  method: string = 'post',
  maxRetry: number = 5,
) =>
  fetchEnsureOk(url, {
    body: body ? JSON.stringify(body) : undefined,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    method,
  }, maxRetry);

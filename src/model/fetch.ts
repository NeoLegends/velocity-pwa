import { InvalidStatusCodeError } from ".";
import { getBearerHeader, refreshJwt } from "./authentication";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Performs a fetch request and retries it in case of a network error.
 *
 * @param url the url to fetch
 * @param init fetch parameters
 * @param maxRetry the maximum amount of retries to perform until an error is thrown
 */
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

/**
 * Creates a fetch function that fetches the given HTTP status to a `null` value.
 *
 * @param nullStatus the status to listen for an deserialize to `null`.
 */
const fetchStatusToNull = (nullStatus: number) => async (
  url: string,
  init?: RequestInit,
  maxRetry: number = 5,
  authenticateWithJWT: boolean = true,
) => {
  const resp = await fetchWithRetry(
    url,
    {
      ...init,
      credentials: "include",
      headers: {
        ...(authenticateWithJWT ? getBearerHeader() : {}),
      },
    },
    maxRetry,
  );

  const { ok, status } = resp;

  if (status === nullStatus) {
    return null;
  }

  const json = await resp.json();
  if (authenticateWithJWT && status === 403 && json.code === "JWT_EXPIRED") {
    await refreshJwt();
    return fetchStatusToNull(nullStatus)(url, init, maxRetry);
  }
  if (!ok) {
    throw new InvalidStatusCodeError(status, url);
  }

  return json;
};

/** Performs a fetch request and returns 204-responses as `null`-value */
export const fetch204ToNull = fetchStatusToNull(204);

/** Performs a fetch request and returns 404-responses as `null`-value */
export const fetch404ToNull = fetchStatusToNull(404);

/**
 * Performs a fetch request (with retries in case of a network error) and
 * ensures an ok HTTP status code.
 *
 * @param url the url to fetch
 * @param init fetch parameters
 * @param maxRetry the maximum amount of retries to perform until an error is thrown
 */
export const fetchEnsureOk = async (
  url: string,
  init?: RequestInit,
  maxRetry: number = 5,
  authenticateWithJWT: boolean = true,
) => {
  const resp = await fetchWithRetry(
    url,
    {
      ...init,
      credentials: "include",
      headers: {
        ...(authenticateWithJWT ? getBearerHeader() : {}),
        ...init?.headers,
      },
    },
    maxRetry,
  );

  if (!resp.ok) {
    throw new InvalidStatusCodeError(resp.status, url);
  }

  return resp;
};

/**
 * Performs a fetch request (with retries in case of a network error), ensures an
 * ok HTTP status code and deserializes the response as JSON.
 *
 * @param url the url to fetch
 * @param init fetch parameters
 * @param maxRetry the maximum amount of retries to perform until an error is thrown
 */
export const fetchJsonEnsureOk = (
  url: string,
  init?: RequestInit,
  maxRetry: number = 5,
  authenticateWithJWT: boolean = true,
) =>
  fetchEnsureOk(url, init, maxRetry, authenticateWithJWT).then((resp) =>
    resp.json(),
  );

/**
 * POSTs JSON data to the given URL.
 *
 * @param url the url to POST data to
 * @param body the data to POST
 * @param method the HTTP method to use, defaults to POST
 * @param maxRetry the maximum amount of retries to perform until an error is thrown
 */
export const postJsonEnsureOk = (
  url: string,
  body?: unknown,
  method: string = "post",
  maxRetry: number = 5,
  authenticateWithJWT: boolean = true,
) =>
  fetchEnsureOk(
    url,
    {
      body: body ? JSON.stringify(body) : undefined,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      method,
    },
    maxRetry,
    authenticateWithJWT,
  );

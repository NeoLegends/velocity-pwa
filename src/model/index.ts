export class InvalidStatusCodeError extends Error {
  constructor(public code: number, url: string) {
    super(`Received invalid status code ${code} while fetching '${url}'.`);
  }
}

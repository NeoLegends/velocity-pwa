import { Invoice } from ".";
import { fetchJsonEnsureOk } from "./fetch";
import { JWT_INVOICES_URL } from "./urls";

/** Fetches the invoices for the currently signed in user. */
export const getAllInvoices = (): Promise<Invoice[]> =>
  fetchJsonEnsureOk(JWT_INVOICES_URL);

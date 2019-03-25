import { Invoice } from '.';
import { fetchJsonEnsureOk } from './fetch';
import { APP_INVOICES_URL } from './urls';

/** Fetches the invoices for the currently signed in user. */
export const getAllInvoices = (): Promise<Invoice[]> =>
  fetchJsonEnsureOk(APP_INVOICES_URL);

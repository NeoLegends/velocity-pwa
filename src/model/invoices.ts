import { Invoice } from '.';
import { fetchJsonEnsureOk } from './fetch';
import { APP_INVOICES_URL } from './urls';

export const getAllInvoices = (): Promise<Invoice[]> =>
  fetchJsonEnsureOk(APP_INVOICES_URL);

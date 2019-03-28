import { Transaction } from '.';
import { fetch204ToNull } from './fetch';
import { transactionsUrl } from './urls';

/**
 * Gets the transactions of the currently signed in user.
 *
 * @param page the transaction page to fetch (a page contains 20 transactions).
 */
export const getTransactions = (page: number): Promise<Transaction[]> =>
  fetch204ToNull(transactionsUrl(page)).then(maybeTrans => maybeTrans || []);

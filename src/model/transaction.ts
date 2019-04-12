import { RunningTransaction, Transaction } from '.';
import { fetch204ToNull } from './fetch';
import { transactionsUrl, APP_CURRENT_TRANSACTION_URL } from './urls';

/**
 * Gets the currently running transaction, if one exists.
 */
export const getCurrentTransaction = (): Promise<RunningTransaction | null> =>
  fetch204ToNull(APP_CURRENT_TRANSACTION_URL);

/**
 * Gets the transactions of the currently signed in user.
 *
 * @param page the transaction page to fetch (a page contains 20 transactions).
 */
export const getTransactions = (page: number): Promise<Transaction[]> =>
  fetch204ToNull(transactionsUrl(page)).then(maybeTrans => maybeTrans || []);

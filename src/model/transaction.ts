import { Transaction } from '.';
import { fetchJsonEnsureOk } from './fetch';
import { transactionsUrl } from './urls';

export const getTransactions = (page: number): Promise<Transaction[]> =>
  fetchJsonEnsureOk(transactionsUrl(page));

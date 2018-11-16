import { Booking, Transaction } from '.';
import { fetch404ToNull, fetchEnsureOk } from './fetch';
import { transactionsUrl, APP_CURRENT_BOOKING_URL } from './urls';

export const getCurrentBooking = (): Promise<Booking | null> =>
  fetch404ToNull(APP_CURRENT_BOOKING_URL);

export const getTransactions = (page: number): Promise<Transaction[]> =>
  fetchEnsureOk(transactionsUrl(page));

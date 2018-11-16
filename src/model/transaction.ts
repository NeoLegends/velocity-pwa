import { Booking, InvalidStatusCodeError, Transaction } from '.';
import { fetchEnsureOk } from './fetch';
import { transactionsUrl, APP_CURRENT_BOOKING_URL } from './urls';

export const getCurrentBooking = async (): Promise<Booking | null> => {
  const resp = await fetch(APP_CURRENT_BOOKING_URL, { credentials: 'include' });
  if (!resp.ok) {
    throw new InvalidStatusCodeError(resp.status, APP_CURRENT_BOOKING_URL);
  }
  return resp.status !== 204
    ? resp.json()
    : null;
};

export const getTransactions = (page: number): Promise<Transaction[]> =>
  fetchEnsureOk(transactionsUrl(page));

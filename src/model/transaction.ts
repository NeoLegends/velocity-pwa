import { Booking, InvalidStatusCodeError, Transaction } from '.';
import { fetch204ToNull, fetchEnsureOk, fetchJsonEnsureOk } from './fetch';
import { transactionsUrl, APP_CURRENT_BOOKING_URL } from './urls';

export const cancelCurrentBooking = (): Promise<void> =>
  fetchEnsureOk(APP_CURRENT_BOOKING_URL, { method: 'delete' })
    .then(() => {});

export const getCurrentBooking = (): Promise<Booking | null> =>
  fetch204ToNull(APP_CURRENT_BOOKING_URL);

export const getTransactions = (page: number): Promise<Transaction[]> =>
  fetchJsonEnsureOk(transactionsUrl(page));

export const hasCurrentBooking = async () => {
  try {
    return !!(await getCurrentBooking());
  } catch (err) {
    // Not signed in
    if ((err as InvalidStatusCodeError).statusCode === 401) {
      return false;
    }

    throw err;
  }
};

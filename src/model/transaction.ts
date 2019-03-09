import { Booking, InvalidStatusCodeError, Transaction } from '.';
import { fetch204ToNull, fetchEnsureOk, fetchJsonEnsureOk } from './fetch';
import { transactionsUrl, APP_CURRENT_BOOKING_URL } from './urls';

export const cancelCurrentBooking = (): Promise<void> =>
  fetchEnsureOk(APP_CURRENT_BOOKING_URL, { method: "delete" }).then(() => {});

export const getCurrentBooking = async (): Promise<Booking | null> => {
  try {
    return await fetch204ToNull(APP_CURRENT_BOOKING_URL);
  } catch (err) {
    // Not signed in
    if ((err as InvalidStatusCodeError).statusCode === 401) {
      return null;
    }

    throw err;
  }
};

export const getTransactions = (page: number): Promise<Transaction[]> =>
  fetchJsonEnsureOk(transactionsUrl(page));

export const hasCurrentBooking = () =>
  getCurrentBooking().then(booking => Boolean(booking));

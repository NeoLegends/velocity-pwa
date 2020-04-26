import {
  Booking,
  InvalidStatusCodeError,
  Rent,
  Slots,
  Station,
  StationWithAddress,
} from '.';
import {
  fetch204ToNull,
  fetch404ToNull,
  fetchEnsureOk,
  fetchJsonEnsureOk,
  postJsonEnsureOk,
} from './fetch';
import {
  rentBikeUrl,
  reserveBikeUrl,
  singleStationUrl,
  slotInfoUrl,
  APP_ALL_STATIONS_URL,
  APP_CURRENT_BOOKING_URL,
} from './urls';

/**
 * Books a bike at the station with the given ID.
 *
 * @param stationId the ID of the station to book a bike at.
 */
export const bookBike = (stationId: number): Promise<Booking> =>
  postJsonEnsureOk(reserveBikeUrl(stationId)).then((resp) => resp.json());

/** Cancels the current booking, if it exists. */
export const cancelCurrentBooking = (): Promise<void> =>
  fetchEnsureOk(APP_CURRENT_BOOKING_URL, { method: 'delete' }).then(() => {});

/** Fetches all existing bike stations. */
export const getAllStations = (): Promise<Station[]> =>
  fetchJsonEnsureOk(APP_ALL_STATIONS_URL).then((stations) =>
    stations.sort((a, b) => a.name.localeCompare(b.name)),
  );

/** Gets the current booking. Returns `null` if there is no user signed in. */
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

/**
 * Gets detailed information about a single station.
 *
 * @param stationId the ID of the station to get the detail info for.
 */
export const getSingleStation = (
  stationId: number,
): Promise<StationWithAddress | null> =>
  fetch404ToNull(singleStationUrl(stationId));

/**
 * Gets slot info for the station with the given ID.
 *
 * @param stationId the ID of the station to get the slot info for.
 */
export const getSlotInfo = (stationId: number): Promise<Slots | null> =>
  fetch404ToNull(slotInfoUrl(stationId));

/** Determines if the current user has a bike booked. */
export const hasCurrentBooking = () =>
  getCurrentBooking().then((booking) => Boolean(booking));

/**
 * Rents out a bike from the given station.
 *
 * @param cardPin the card PIN of the currently signed in user.
 * @param stationId the ID of the station to rent at.
 * @param stationSlotId the ID of the slot whose bike is to be rented.
 */
export const rentBike = async (
  cardPin: string,
  stationId: number,
  stationSlotId: number,
): Promise<Rent> =>
  postJsonEnsureOk(rentBikeUrl(stationId), {
    cardPin,
    stationSlotId,
  }).then((resp) => resp.json());

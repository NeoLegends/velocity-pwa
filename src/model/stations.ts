import {
  Booking,
  InvalidStatusCodeError,
  Rent,
  Reservation,
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

export const bookBike = (stationId: number): Promise<Reservation> =>
  postJsonEnsureOk(reserveBikeUrl(stationId))
    .then(resp => resp.json());

export const cancelCurrentBooking = (): Promise<void> =>
  fetchEnsureOk(APP_CURRENT_BOOKING_URL, { method: "delete" }).then(() => {});

export const getAllStations = (): Promise<Station[]> =>
  fetchJsonEnsureOk(APP_ALL_STATIONS_URL)
    .then(stations => stations.sort((a, b) => a.name.localeCompare(b.name)));

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

export const getSingleStation = (stationId: number): Promise<StationWithAddress | null> =>
  fetch404ToNull(singleStationUrl(stationId));

export const getSlotInfo = (stationId: number): Promise<Slots | null> =>
  fetch404ToNull(slotInfoUrl(stationId));

export const hasCurrentBooking = () =>
  getCurrentBooking().then(booking => Boolean(booking));

export const rentBike = async (
  cardPin: string,
  stationId: number,
  stationSlotId: number,
): Promise<Rent> => {
  return postJsonEnsureOk(rentBikeUrl(stationId), { cardPin, stationSlotId })
    .then(resp => resp.json());
};

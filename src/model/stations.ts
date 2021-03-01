import { Booking, Rent, Slots, Station, StationWithAddress } from ".";
import { isLoggedIn } from "./authentication";
import {
  fetch204ToNull,
  fetch404ToNull,
  fetchEnsureOk,
  fetchJsonEnsureOk,
  postJsonEnsureOk,
} from "./fetch";
import {
  rentBikeUrl,
  reserveBikeUrl,
  singleStationUrl,
  singleStationUrlUnauthed,
  slotInfoUrl,
  slotInfoUrlUnauthed,
  APP_ALL_STATIONS_URL,
  JWT_ALL_STATIONS_URL,
  JWT_CURRENT_BOOKING_URL,
} from "./urls";

/**
 * Books a bike at the station with the given ID.
 *
 * @param stationId the ID of the station to book a bike at.
 */
export const bookBike = (stationId: number): Promise<Booking> =>
  postJsonEnsureOk(reserveBikeUrl(stationId)).then((resp) => resp.json());

/** Cancels the current booking, if it exists. */
export const cancelCurrentBooking = (): Promise<void> =>
  fetchEnsureOk(JWT_CURRENT_BOOKING_URL, { method: "delete" }).then(() => {});

const sortStations = (stations: any[]) =>
  stations.sort((a: Station, b: Station) => a.name.localeCompare(b.name));

/** Fetches all existing bike stations using the public API */
export const getAllStations = (): Promise<Station[]> =>
  fetchJsonEnsureOk(APP_ALL_STATIONS_URL, undefined, 5, false).then(
    sortStations,
  );

/** Fetches all existing bike stations as the logged-in user. */
export const getAllStationsAsUser = (): Promise<Station[]> =>
  fetchJsonEnsureOk(JWT_ALL_STATIONS_URL).then(sortStations);

/** Gets the current booking. Returns `null` if there is no user signed in. */
export const getCurrentBooking = async (): Promise<Booking | null> => {
  if (isLoggedIn()) {
    return fetch204ToNull(JWT_CURRENT_BOOKING_URL);
  }
  return null;
};

/**
 * Gets detailed information about a single station using the public API
 *
 * @param stationId the ID of the station to get the detail info for.
 */
export const getSingleStation = (
  stationId: number,
): Promise<StationWithAddress | null> =>
  fetch404ToNull(singleStationUrlUnauthed(stationId), undefined, 5, false);

/**
 * Gets detailed information about a single station as as the logged-in user.
 *
 * @param stationId the ID of the station to get the detail info for.
 */
export const getSingleStationAsUser = (
  stationId: number,
): Promise<StationWithAddress | null> =>
  fetch404ToNull(singleStationUrl(stationId));

/**
 * Gets slot info for the station with the given ID using the public API
 *
 * @param stationId the ID of the station to get the slot info for.
 */
export const getSlotInfo = (stationId: number): Promise<Slots | null> =>
  fetch404ToNull(slotInfoUrlUnauthed(stationId), undefined, 5, false);

/**
 * Gets slot info for the station with the given ID as the logged-in user.
 *
 * @param stationId the ID of the station to get the slot info for.
 */
export const getSlotInfoAsUser = (stationId: number): Promise<Slots | null> =>
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

import {
  Rent,
  Reservation,
  Slots,
  Station,
  StationWithAddress,
} from '.';
import { fetch404ToNull, fetchJsonEnsureOk, postJsonEnsureOk } from './fetch';
import {
  rentBikeUrl,
  reserveBikeUrl,
  singleStationUrl,
  slotInfoUrl,
  APP_ALL_STATIONS_URL,
} from './urls';

export const getAllStations = async (): Promise<Station[]> =>
  fetchJsonEnsureOk(APP_ALL_STATIONS_URL);

export const getSingleStation = async (stationId: number): Promise<StationWithAddress | null> =>
  fetch404ToNull(singleStationUrl(stationId));

export const getSlotInfo = async (stationId: number): Promise<Slots | null> =>
  fetch404ToNull(slotInfoUrl(stationId));

export const rentBike = async (
  cardPin: string,
  stationId: number,
  stationSlotId: number,
): Promise<Rent> =>
  postJsonEnsureOk(rentBikeUrl(stationId), { cardPin, stationSlotId })
    .then(resp => resp.json());

export const reserveBike = async (stationId: number): Promise<Reservation> =>
  postJsonEnsureOk(reserveBikeUrl(stationId))
    .then(resp => resp.json());

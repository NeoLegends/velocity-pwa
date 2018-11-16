import {
  Rent,
  Reservation,
  Slots,
  Station,
  StationWithAddress,
} from '.';
import { fetch404ToNull, fetchEnsureOk } from './fetch';
import {
  rentBikeUrl,
  reserveBikeUrl,
  singleStationUrl,
  slotInfoUrl,
  APP_ALL_STATIONS_URL,
} from './urls';

export const getAllStations = async (): Promise<Station[]> =>
  fetchEnsureOk(APP_ALL_STATIONS_URL);

export const getSingleStation = async (stationId: number): Promise<StationWithAddress | null> =>
  fetch404ToNull(singleStationUrl(stationId));

export const getSlotInfo = async (stationId: number): Promise<Slots | null> =>
  fetch404ToNull(slotInfoUrl(stationId));

export const rentBike = async (
  cardPin: string,
  stationId: number,
  stationSlotId: number,
): Promise<Rent> =>
  fetchEnsureOk(rentBikeUrl(stationId), {
    body: JSON.stringify({ cardPin, stationSlotId }),
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
  });

export const reserveBike = async (stationId: number): Promise<Reservation> =>
  fetchEnsureOk(reserveBikeUrl(stationId), { method: 'post' });

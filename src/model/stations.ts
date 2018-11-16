import { InvalidStatusCodeError } from '.';
import {
  rentBikeUrl,
  reserveBikeUrl,
  singleStationUrl,
  slotInfoUrl,
  APP_ALL_STATIONS_URL,
} from './urls';

export type OperationState = 'OPERATIVE' | 'INOPERATIVE';

export interface Address {
  city: string;
  country: string;
  streetAndHousenumber: string;
  zip: string;
}

export interface PedelecInfo {
  availability: 'AVAILABLE' | 'INOPERATIVE' | 'RESERVED';
  stateOfCharge: number;
}

export interface Rent {
  stationSlotId: number;
  stationSlotPosition: number;
}

export interface Reservation {
  expiryDateTime: string;
  stationId: number;
  stationSlotPosition: number;
}

export interface Slot {
  isOccupied: boolean;
  pedelecInfo?: PedelecInfo;
  state: OperationState;
  stateOfCharge: number | null;
  stationSlotId: number;
  stationSlotPosition: number;
}

export interface Station {
  locationLatitude: number;
  locationLongitude: number;
  name: string;
  note: string;
  numAllSlots: number;
  numFreeSlots: number;
  state: OperationState;
  stationId: number;
}

export interface StationWithAddress extends Station {
  address: Address;
}

export interface Slots {
  recommendedSlot?: number;
  stationSlots: Slot[];
}

export const getAllStations = async (): Promise<Station[]> => {
  const resp = await fetch(APP_ALL_STATIONS_URL);
  if (!resp.ok) {
    throw new InvalidStatusCodeError(resp.status, APP_ALL_STATIONS_URL);
  }

  return resp.json();
};

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

const fetch404ToNull = async (url: string) => {
  const resp = await fetch(url);

  if (!resp.ok) {
    if (resp.status === 404) {
      return null;
    }

    throw new InvalidStatusCodeError(resp.status, url);
  }

  return resp.json();
};

const fetchEnsureOk = async (url: string, init?: RequestInit) => {
  const resp = await fetch(url, init);

  if (!resp.ok) {
    throw new InvalidStatusCodeError(resp.status, url);
  }

  return resp.json();
};
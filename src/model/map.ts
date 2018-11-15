import { InvalidStatusCodeError } from '.';
import { singleStationUrl, APP_ALL_STATIONS_URL } from './urls';

export interface Address {
  city: string;
  country: string;
  streetAndHousenumber: string;
  zip: string;
}

export interface Station {
  locationLatitude: number;
  locationLongitude: number;
  name: string;
  note: string;
  numAllSlots: number;
  numFreeSlots: number;
  state: 'OPERATIVE';
  sationId: number;
}

export interface StationWithAddress extends Station {
  address: Address;
}

export const getSingleStation = async (
  stationId: number,
): Promise<StationWithAddress | null> => {
  const url = singleStationUrl(stationId);
  const resp = await fetch(url);

  if (!resp.ok) {
    if (resp.status === 404) {
      return null;
    }

    throw new InvalidStatusCodeError(resp.status, url);
  }

  return resp.json();
};

export const getAllStations = async (): Promise<Station[]> => {
  const resp = await fetch(APP_ALL_STATIONS_URL);
  if (!resp.ok) {
    throw new InvalidStatusCodeError(resp.status, APP_ALL_STATIONS_URL);
  }

  return resp.json();
};

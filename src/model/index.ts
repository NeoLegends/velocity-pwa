export interface Address {
  city: string;
  country: string;
  streetAndHousenumber: string;
  zip: string;
}

export interface Booking {
  expiryDateTime: string;
  stationId: number;
  stationSlotPosition: number;
}

export interface Invoice {
  month: number;
  sum: number;
  url: string;
  year: number;
}

export type OperationState = 'OPERATIVE' | 'INOPERATIVE';

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

export interface Station extends StationSimple {
  locationLatitude: number;
  locationLongitude: number;
  note: string;
  numAllSlots: number;
  numFreeSlots: number;
  state: OperationState;
}

export interface StationSimple {
  name: string;
  stationId: number;
}

export interface StationWithAddress extends Station {
  address: Address;
}

export interface Slots {
  recommendedSlot?: number;
  stationSlots: Slot[];
}

export interface Tariff {
  description: string;
  name: string;
  periodicRate: number;
  tariffId: number;
  term: number;
}

export interface Transaction {
  distance: number;
  endDateTime: string;
  fees: number;
  fromStation: StationSimple;
  lockAvailable: boolean;
  pedelecName: string;
  startDateTime: string;
  toStation: StationSimple;
  transactionId: number;
}

export interface UserTariff {
  automaticRenewal: boolean;
  expiryDateTime: string;
  name: string;
  tariffId: number;
}

export class InvalidStatusCodeError extends Error {
  constructor(public code: number, public url: string) {
    super(`Received invalid status code ${code} while fetching '${url}'.`);
  }
}

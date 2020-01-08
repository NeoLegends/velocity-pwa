export interface Address {
  city: string;
  country: string;
  streetAndHousenumber: string;
  zip: string;
}

export interface BankDetails {
  bankName: string;
  bic: string;
  iban: string;
}

export interface Booking {
  expiryDateTime: string;
  stationId: number;
  stationSlotPosition: number;
}

export interface Customer {
  address: Address;
  birthday: string;
  customerId: string;
  firstname: string;
  isActivated: boolean;
  isPinLocked: boolean;
  lastname: string;
  login: string;
  phonenumber: string | null;
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

export interface SepaMandate extends BankDetails {
  address: Address;
  date: string;
  firstname: string;
  lastname: string;
  reference: string;
}

export interface Slot {
  isOccupied: boolean;
  pedelecInfo?: PedelecInfo;
  state: OperationState;
  stateOfCharge: number | null;
  stationSlotId: number;
  stationSlotPosition: number;
}

export interface Slots {
  recommendedSlot?: number;
  stationSlots: Slot[];
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

export type DeviceSupportType = 'station' | 'pedelec';
export type SupportType = DeviceSupportType | 'feedback';

export interface Tariff {
  description: string;
  name: string;
  periodicRate: number;
  tariffId: number;
  term: number;
}

export interface RunningTransaction {
  fromStation: StationSimple;
  lockAvailable: boolean;
  pedelecName: string;
  startDateTime: string;
  transactionId: number;
}

export interface Transaction extends RunningTransaction {
  distance: number;
  endDateTime: string;
  fees: number;
  toStation: StationSimple;
  credited: boolean;
}

export interface UserTariff {
  automaticRenewal: boolean;
  expiryDateTime: string;
  name: string;
  tariffId: number;
}

export class InvalidStatusCodeError extends Error {
  constructor(public statusCode: number, public url: string) {
    super(
      `Received invalid status code ${statusCode} while fetching '${url}'.`,
    );
  }
}

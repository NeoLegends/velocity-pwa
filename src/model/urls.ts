import { LanguageIdentifier } from "../resources/language";

import { SupportType } from ".";

const BACKEND_URL = "/backend";
const INVOICES_URL = "/invoices";
export const TILE_URL = "/tile/{z}/{x}/{y}";

export const invoiceUrl = (fileName: string) => `${INVOICES_URL}/${fileName}`;

const APP_URL = `${BACKEND_URL}/app`;
const APP_V2_URL = `${BACKEND_URL}/v2/app`;
const JWT_URL = `${APP_URL}/jwt`;
const JWT_V2_URL = `${APP_V2_URL}/jwt`;

// PUBLICLY AVAILABLE ROUTES

export const APP_ALL_STATIONS_URL = `${APP_URL}/stations`;

export const singleStationUrlUnauthed = (statId: number) =>
  `${APP_ALL_STATIONS_URL}/${encode(String(statId))}`;
export const slotInfoUrlUnauthed = (statId: number) =>
  `${singleStationUrlUnauthed(statId)}/slots/full`;

// AUTHENTICATED ROUTES

export const JWT_AUTH_URL = `${JWT_URL}/auth`;
export const JWT_LOGIN_REFRESH = `${JWT_AUTH_URL}/refresh`;
export const JWT_LOGOUT_URL = `${JWT_AUTH_URL}/logout`;

export const JWT_TRANSACTIONS_URL = `${JWT_URL}/transactions`;
export const JWT_ALL_STATIONS_URL = `${JWT_V2_URL}/stations`;
export const JWT_CURRENT_BOOKING_URL = `${JWT_URL}/booking`;
export const JWT_CUSTOMER_URL = `${JWT_URL}/customer`;

export const JWT_TRANSACTION_OPEN_URL = `${JWT_TRANSACTIONS_URL}/open`;
export const JWT_CHANGE_ADDRESS_URL = `${JWT_CUSTOMER_URL}/address`;
export const JWT_CHANGE_PIN_URL = `${JWT_CUSTOMER_URL}/pin`;
export const JWT_CHANGE_TEL_URL = `${JWT_CUSTOMER_URL}/phone`;
export const JWT_PASSWORD_RESET_REQUEST_URL = `${JWT_CUSTOMER_URL}/passwordreset-request`;
export const JWT_CURRENT_TARIFF_URL = `${JWT_CUSTOMER_URL}/tariff`;
export const JWT_INVOICES_URL = `${JWT_CUSTOMER_URL}/invoices?view=SUMMARY`;
export const JWT_TOGGLE_TARIFF_RENEWAL_URL = `${JWT_CURRENT_TARIFF_URL}/auto-renewal`;
export const JWT_SEPA_MANDATE_URL = `${JWT_CUSTOMER_URL}/bankaccount/sepa`;

export const JWT_SUPPORT_URL = `${JWT_URL}/support`;

// For better minification
const encode = encodeURIComponent;

export const singleStationUrl = (statId: number) =>
  `${JWT_ALL_STATIONS_URL}/${encode(String(statId))}`;
export const feedbackUrl = (type: SupportType) =>
  `${JWT_SUPPORT_URL}/${encode(type)}`;
export const rentBikeUrl = (statId: number) =>
  `${singleStationUrl(statId)}/rent`;
export const reserveBikeUrl = (statId: number) =>
  `${singleStationUrl(statId)}/book`;
export const slotInfoUrl = (statId: number) =>
  `${singleStationUrl(statId)}/slots/full`;
export const tariffsUrl = (lang: LanguageIdentifier) =>
  `${APP_URL}/tariffs?lang=${encode(lang)}`;
export const transactionsUrl = (page: number) =>
  `${JWT_TRANSACTIONS_URL}?page=${encode(String(page))}`;

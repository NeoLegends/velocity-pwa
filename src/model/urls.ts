import { LanguageIdentifier } from '../resources/language';

import { SupportType } from '.';

const BACKEND_URL = '/backend';
const INVOICES_URL = '/invoices';
export const TILE_URL = 'https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png';

export const invoiceUrl = (fileName: string) => `${INVOICES_URL}/${fileName}`;

const API_URL = `${BACKEND_URL}/api`;
const APP_URL = `${BACKEND_URL}/app`;

export const API_IS_AUTHENTICATED_URL = `${API_URL}/authenticate`;
export const API_LOGIN_URL = `${API_URL}/authentication`;
export const API_LOGOUT_URL = `${API_URL}/logout`;

export const APP_ALL_STATIONS_URL = `${APP_URL}/stations`;
export const APP_CURRENT_BOOKING_URL = `${APP_URL}/booking`;
export const APP_CUSTOMER_URL = `${APP_URL}/customer`;
export const APP_CHANGE_ADDRESS_URL = `${APP_CUSTOMER_URL}/address`;
export const APP_CHANGE_PIN_URL = `${APP_CUSTOMER_URL}/pin`;
export const APP_CHANGE_TEL_URL = `${APP_CUSTOMER_URL}/phone`;
export const APP_PASSWORD_RESET_REQUEST_URL = `${APP_CUSTOMER_URL}/passwordreset-request`;
export const APP_CURRENT_TARIFF_URL = `${APP_CUSTOMER_URL}/tariff`;
export const APP_INVOICES_URL = `${APP_CUSTOMER_URL}/invoices?view=SUMMARY`;
export const APP_SUPPORT_URL = `${APP_URL}/support`;
export const APP_TOGGLE_TARIFF_RENEWAL_URL = `${APP_CURRENT_TARIFF_URL}/auto-renewal`;
export const APP_SEPA_MANDATE_URL = `${APP_CUSTOMER_URL}/bankaccount/sepa`;
export const APP_TRANSACTIONS_URL = `${APP_URL}/transactions`;
export const APP_CURRENT_TRANSACTION_URL = `${APP_TRANSACTIONS_URL}/open`;

// For better minification
const encode = encodeURIComponent;

export const singleStationUrl = (statId: number) =>
  `${APP_ALL_STATIONS_URL}/${encode(String(statId))}`;

export const feedbackUrl = (type: SupportType) =>
  `${APP_SUPPORT_URL}/${encode(type)}`;
export const rentBikeUrl = (statId: number) =>
  `${singleStationUrl(statId)}/rent`;
export const reserveBikeUrl = (statId: number) =>
  `${singleStationUrl(statId)}/book`;
export const slotInfoUrl = (statId: number) =>
  `${singleStationUrl(statId)}/slots/full`;
export const tariffsUrl = (lang: LanguageIdentifier) =>
  `${APP_URL}/tariffs?lang=${encode(lang)}`;
export const transactionsUrl = (page: number) =>
  `${APP_TRANSACTIONS_URL}?page=${encode(String(page))}`;

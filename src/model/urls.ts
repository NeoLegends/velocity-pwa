import { LanguageIdentifier } from '../resources/language';

import { SupportType } from '.';

export const TILE_URL = process.env.NODE_ENV === 'production'
    ? "/tile/{z}/{x}/{y}"
    : "http://localhost:8000/tile/{z}/{x}/{y}";

const INVOICES_URL = process.env.NODE_ENV === 'production'
    ? "/invoices"
    : "http://localhost:8000/invoices";

export const invoiceUrl = (fileName: string) => `${INVOICES_URL}/${fileName}`;

const BACKEND_URL =
  process.env.NODE_ENV === 'production'
    ? '/backend'
    : 'http://localhost:8000/backend';

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

export const singleStationUrl = (statId: number) =>
  `${APP_ALL_STATIONS_URL}/${statId}`;

export const feedbackUrl = (type: SupportType) => `${APP_SUPPORT_URL}/${type}`;
export const rentBikeUrl = (statId: number) =>
  `${singleStationUrl(statId)}/rent`;
export const reserveBikeUrl = (statId: number) =>
  `${singleStationUrl(statId)}/book`;
export const slotInfoUrl = (statId: number) =>
  `${singleStationUrl(statId)}/slots/full`;
export const tariffsUrl = (lang: LanguageIdentifier) =>
  `${APP_URL}/tariffs?lang=${lang}`;
export const transactionsUrl = (page: number) =>
  `${APP_URL}/transactions?page=${page}`;

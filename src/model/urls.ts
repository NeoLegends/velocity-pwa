const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://velocity-pwa.netlify.com/backend'
  : 'http://localhost:8000/backend';
const API_URL = `${BACKEND_URL}/api`;
const APP_URL = `${BACKEND_URL}/app`;

export const API_IS_AUTHENTICATED_URL = `${API_URL}/authenticate`;
export const API_LOGIN_URL = `${API_URL}/authentication`;
export const API_LOGOUT_URL = `${API_URL}/logout`;

export const APP_ALL_STATIONS_URL = `${APP_URL}/stations`;
export const APP_CURRENT_BOOKING_URL = `${APP_URL}/booking`;
export const APP_CURRENT_TARIFF_URL = `${APP_URL}/customer/tariff`;
export const APP_INVOICES_URL = `${APP_URL}/customer/invoices?view=SUMMARY`;
export const APP_TOGGLE_TARIFF_RENEWAL_URL = `${APP_CURRENT_TARIFF_URL}/auto-renewal`;

export const singleStationUrl = (statId: number) => `${APP_ALL_STATIONS_URL}/${statId}`;

export const rentBikeUrl = (statId: number) => `${singleStationUrl(statId)}/rent`;
export const reserveBikeUrl = (statId: number) => `${singleStationUrl(statId)}/book`;
export const slotInfoUrl = (statId: number) => `${singleStationUrl(statId)}/slots/full`;
export const tariffsUrl = (lang: 'de' | 'en') => `${APP_URL}/tariffs?lang=${lang}`;
export const transactionsUrl = (page: number) => `${APP_URL}/transactions?page=${page}`;

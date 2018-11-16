const BACKEND_URL = 'https://velocity-pwa.netlify.com/backend';
const API_URL = `${BACKEND_URL}/api`;
const APP_URL = `${BACKEND_URL}/app`;

export const API_IS_AUTHENTICATED_URL = `${API_URL}/authenticate`;
export const API_LOGIN_URL = `${API_URL}/authentication`;
export const API_LOGOUT_URL = `${API_URL}/logout`;

export const APP_ALL_STATIONS_URL = `${APP_URL}/stations`;
export const APP_CURRENT_BOOKING_URL = `${APP_URL}/booking`;

export const singleStationUrl = (statId: number) => `${APP_ALL_STATIONS_URL}/${statId}`;

export const rentBikeUrl = (statId: number) => `${singleStationUrl(statId)}/rent`;
export const reserveBikeUrl = (statId: number) => `${singleStationUrl(statId)}/book`;
export const slotInfoUrl = (statId: number) => `${singleStationUrl(statId)}/slots/full`;
export const transactionsUrl = (page: number) => `${APP_URL}/transactions?page=${page}`;

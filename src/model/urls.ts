const BACKEND_URL = 'https://velocity-pwa.netlify.com/backend';

export const API_IS_AUTHENTICATED_URL = `${BACKEND_URL}/api/authenticate`;
export const API_LOGIN_URL = `${BACKEND_URL}/api/authentication`;
export const API_LOGOUT_URL = `${BACKEND_URL}/api/logout`;
export const APP_ALL_STATIONS_URL = `${BACKEND_URL}/app/stations`;

export const singleStationUrl = (statId: number) => `${APP_ALL_STATIONS_URL}/${statId}`;
export const slotInfoUrl = (statId: number) => `${singleStationUrl(statId)}/slots/full`;

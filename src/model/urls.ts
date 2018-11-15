const BACKEND_URL = 'https://velocity-pwa.netlify.com/backend';

export const API_AUTHENTICATION_URL = `${BACKEND_URL}/api/authentication`;
export const APP_ALL_STATIONS_URL = `${BACKEND_URL}/app/stations`;
export const singleStationUrl = (statId: number) => `${APP_ALL_STATIONS_URL}/${statId}`;

const PIN_LS_KEY = 'velocity/card-pin';

export const eraseCardPin = () => localStorage.removeItem(PIN_LS_KEY);

export const getSavedCardPin = () => {
  const lsItem = localStorage.getItem(PIN_LS_KEY);
  return lsItem || null;
};

export const setCardPin = (pin: string) => localStorage.setItem(PIN_LS_KEY, pin);

const PIN_LS_KEY = 'velocity/card-pin';

/** Erases the stored card PIN from local storage. */
export const eraseCardPin = () => localStorage.removeItem(PIN_LS_KEY);

/**
 * Gets the card PIN saved to local storage. Returns `null` in case there
 * was none saved.
 */
export const getSavedCardPin = () => {
  const lsItem = localStorage.getItem(PIN_LS_KEY);
  return lsItem || null;
};

/** Saves the given card PIN to local storage. */
export const setCardPin = (pin: string) =>
  localStorage.setItem(PIN_LS_KEY, pin);

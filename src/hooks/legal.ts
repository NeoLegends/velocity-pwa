import { useCallback, useEffect, useState } from 'react';

const DISPLAY_POPUP_LS_KEY = 'velocity/has-displayed-unofficial-popup';

export const useUnofficialPopup = () => {
  const [displayUnofficialPopup, setDisplayPopup] = useState(false);

  useEffect(() => {
    const hasDisplayed = localStorage.getItem(DISPLAY_POPUP_LS_KEY);
    setDisplayPopup(!hasDisplayed);
  });

  const hideUnofficialPopup = useCallback(() => {
    localStorage.setItem(DISPLAY_POPUP_LS_KEY, '1');
    setDisplayPopup(false);
  }, []);

  return { displayUnofficialPopup, hideUnofficialPopup };
};

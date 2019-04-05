import { useCallback, useLayoutEffect, useState } from 'react';

import { eraseCardPin, getSavedCardPin, setCardPin } from '../model/pin';

export const useSavedPin = () => {
  const [pin, setPin] = useState<string | null>(null);

  const setPinInLsAndState = useCallback(
    (pin: string | null) => {
      pin !== null ? setCardPin(pin) : eraseCardPin();
      setPin(pin);
    },
    [eraseCardPin, setCardPin],
  );

  useLayoutEffect(() => setPin(getSavedCardPin()), [getSavedCardPin]);

  return [pin, setPinInLsAndState] as [
    string | null,
    (pin: string | null) => void
  ];
};

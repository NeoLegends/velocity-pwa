import { useContext, useDebugValue, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Tariff, UserTariff } from '../model';
import { getCurrentTariff, getTariffs } from '../model/tariff';
import { LanguageContext, LanguageIdContext } from '../resources/language';

export const useTariffs = () => {
  const { TARIFF } = useContext(LanguageContext);
  const languageId = useContext(LanguageIdContext);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);

  useDebugValue(tariffs);

  useEffect(() => {
    getTariffs(languageId)
      .then(setTariffs)
      .catch(err => {
        console.error("Error while loading all available tarrifs:", err);
        toast(
          TARIFF.ALERT.LOAD_TARIFFS_FAIL,
          { type: 'error' },
        );
      });
  }, [TARIFF, languageId]);

  return tariffs;
};

export const useUserTariff = () => {
  const { TARIFF } = useContext(LanguageContext);
  const [userTariff, setUserTariff] = useState<UserTariff | null>(null);
  useDebugValue(userTariff);

  const loadUserTariff = () => {
    getCurrentTariff()
      .then(setUserTariff)
      .catch(err => {
        console.error("Error while loading user tariff:", err);
        toast(
          TARIFF.ALERT.LOAD_TARIFF_FAIL,
          { type: 'error' },
        );
      });
  };

  useEffect(loadUserTariff, [TARIFF]);

  return [userTariff, loadUserTariff] as [UserTariff | null, () => void];
};

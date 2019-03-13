import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Tariff, UserTariff } from '../model';
import { getCurrentTariff, getTariffs } from '../model/tariff';
import { LanguageContext, LanguageIdContext } from '../resources/language';

export const useTariffs = () => {
  const { TARIFF } = useContext(LanguageContext);
  const languageId = useContext(LanguageIdContext);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);

  useEffect(() => {
    getTariffs(languageId)
      .then(setTariffs)
      .catch(err => {
        console.error('Error while loading all available tarrifs:', err);
        toast(TARIFF.ALERT.LOAD_TARIFFS_FAIL, { type: 'error' });
      });
  }, [languageId]);

  return tariffs;
};

export const useUserTariff = () => {
  const { TARIFF } = useContext(LanguageContext);
  const [userTariff, setUserTariff] = useState<UserTariff | null>(null);

  const loadUserTariff = useCallback(() => {
    getCurrentTariff()
      .then(setUserTariff)
      .catch(err => {
        console.error('Error while loading user tariff:', err);
        toast(TARIFF.ALERT.LOAD_TARIFF_FAIL, { type: 'error' });
      });
  }, [TARIFF]);

  useEffect(loadUserTariff, []);

  return [userTariff, loadUserTariff] as [UserTariff | null, () => void];
};

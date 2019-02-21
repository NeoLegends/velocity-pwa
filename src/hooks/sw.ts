import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

import { LanguageContext } from '../resources/language';
import * as serviceWorker from '../serviceWorker';

export const useServiceWorker = () => {
  const { sw } = useContext(LanguageContext);

  useEffect(() => {
    const swConfig = {
      onSuccess: () => toast(sw.NOW_AVAILABLE_OFFLINE),
      onUpdate: () => toast(sw.UPDATE_AVAILABLE, { autoClose: false }),
    };

    process.env.NODE_ENV === 'production'
      ? serviceWorker.register(swConfig)
      : serviceWorker.unregister();
  }, []);
};

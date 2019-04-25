import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { LanguageContext } from '../resources/language';
import * as serviceWorker from '../serviceWorker';
import { isIos } from '../util/is-ios';

export const useDesktopInstallation = () => {
  const [event, setEvent] = useState<BeforeInstallProptEvent | null>(null);

  useEffect(() => {
    const handler = (ev: Event) => {
      ev.preventDefault();
      setEvent(ev as BeforeInstallProptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(() => {
    if (!event) {
      throw new Error('Trying to install to desktop, but no event cached.');
    }

    event.prompt();
  }, [event]);

  return { canInstall: Boolean(event), handleInstall };
};

export const useServiceWorker = () => {
  const { sw } = useContext(LanguageContext);

  useEffect(() => {
    const swConfig = {
      onSuccess: () => toast(sw.NOW_AVAILABLE_OFFLINE),
      onUpdate: () => toast(sw.UPDATE_AVAILABLE, { autoClose: false }),
    };

    process.env.NODE_ENV === 'production' && !isIos
      ? serviceWorker.register(swConfig)
      : serviceWorker.unregister();
  }, [sw]);
};

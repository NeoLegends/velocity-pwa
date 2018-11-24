import React from 'react';

import germanExt from './de-extensions.json';
import german from './de.json';
import englishExt from './en-extensions.json';
import english from './en.json';

export interface CustomTranslations {
  tariff: {
    ACTIVATE_AUTOMATIC_RENEWAL: string;
    DEACTIVATE_AUTOMATIC_RENEWAL: string;
  };
  customer: {
    ACCEPT: string;
    BANK_DETAILS: {
      ACCOUNT_OWNER: string;
      BANK: string;
      BANK_DETAILS: string;
    }
    SEPA_MANDATE: {
      GO_BACK: string;
    }
  };
  menu: string;
  sw: {
    NOW_AVAILABLE_OFFLINE: string;
    UPDATE_AVAILABLE: string;
  };
}

export const de: typeof german & CustomTranslations = {
  ...german,
  ...germanExt,
};

export const en: typeof english & CustomTranslations = {
  ...english,
  ...englishExt,
};

export type LanguageIdentifier = 'de' | 'en';
export type LanguageType = typeof de & typeof en;

export const LanguageContext = React.createContext<LanguageType>(de);
export const LanguageIdContext = React.createContext<LanguageIdentifier>('de');

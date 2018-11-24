import React from 'react';

import german from './de.json';
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
}

export const de: typeof german & CustomTranslations = {
  ...german,
  tariff: {
    ACTIVATE_AUTOMATIC_RENEWAL: "Automatische Verlängerung aktivieren",
    DEACTIVATE_AUTOMATIC_RENEWAL: "Automatische Verlängerung deaktivieren",
  },
  customer: {
    ACCEPT: "Akzeptieren",
    BANK_DETAILS: {
      ACCOUNT_OWNER: "Kontoinhaber",
      BANK: "Bank",
      BANK_DETAILS: "Bankdaten",
    },
    SEPA_MANDATE: {
      GO_BACK: "Zurück",
    },
  },
  menu: "Menü",
};

export const en: typeof english & CustomTranslations = {
  ...english,
  tariff: {
    ACTIVATE_AUTOMATIC_RENEWAL: "Activate automatic renewal",
    DEACTIVATE_AUTOMATIC_RENEWAL: "Deactivate automatic renewal",
  },
  customer: {
    ACCEPT: "Accept",
    BANK_DETAILS: {
      ACCOUNT_OWNER: "Account owner",
      BANK: "Bank",
      BANK_DETAILS: "Bank details",
    },
    SEPA_MANDATE: {
      GO_BACK: "Back",
    },
  },
  menu: "Menu",
};

export type LanguageIdentifier = 'de' | 'en';
export type LanguageType = typeof de & typeof en;

export const LanguageContext = React.createContext<LanguageType>(de);
export const LanguageIdContext = React.createContext<LanguageIdentifier>('de');

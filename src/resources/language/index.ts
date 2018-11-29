import React from 'react';

import germanExt from './de-extensions.json';
import german from './de.json';
import englishExt from './en-extensions.json';
import english from './en.json';

export type CustomTranslations = typeof germanExt & typeof englishExt;

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

export const supportsLanguage = (langId: string) => langId === 'de' || langId === 'en';

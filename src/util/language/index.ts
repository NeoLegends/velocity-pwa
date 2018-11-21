import React from 'react';

import de from './de.json';

export type LanguageType = typeof de;
export type LanguageIdentifier = 'de' | 'en';

export const LanguageContext = React.createContext(de);

import React from "react";

import germanExt from "./de-extensions.json";
import german from "./de.json";
import englishExt from "./en-extensions.json";
import english from "./en.json";

export type LanguageType =
  | (typeof germanExt & typeof german)
  | (typeof englishExt & typeof english);

export type LanguageIdentifier = "de" | "en";

export const de: LanguageType = { ...german, ...germanExt };
export const en: LanguageType = { ...english, ...englishExt };

export const LanguageContext = React.createContext<LanguageType>(de);
export const LanguageIdContext = React.createContext<LanguageIdentifier>("de");

export const supportsLanguage = (
  langId: string,
): langId is LanguageIdentifier => langId === "de" || langId === "en";

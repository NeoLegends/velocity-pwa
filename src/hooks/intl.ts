import { useCallback, useLayoutEffect, useState } from "react";

import {
  de,
  en,
  supportsLanguage,
  LanguageIdentifier,
  LanguageType,
} from "../resources/language";

const LOCALSTORAGE_LANGUAGE_KEY = "velocity/lang";

export const useLanguage = () => {
  const [langId, setLangId] = useState<LanguageIdentifier>("de");
  const [language, setLanguage] = useState<LanguageType>(de);

  const handleChangeLanguage = useCallback((langId: LanguageIdentifier) => {
    localStorage.setItem(LOCALSTORAGE_LANGUAGE_KEY, langId);

    setLangId(langId);
    setLanguage((langId === "en" ? en : de) as LanguageType);
  }, []);

  useLayoutEffect(() => {
    const navigatorLanguage = navigator.language.split("-")[0].trim();
    const lang =
      localStorage.getItem(LOCALSTORAGE_LANGUAGE_KEY) ||
      (supportsLanguage(navigatorLanguage) ? navigatorLanguage : "de");

    handleChangeLanguage(lang as LanguageIdentifier);
  }, [handleChangeLanguage]);

  return [langId, language, handleChangeLanguage] as [
    LanguageIdentifier,
    LanguageType,
    (id: LanguageIdentifier) => void,
  ];
};

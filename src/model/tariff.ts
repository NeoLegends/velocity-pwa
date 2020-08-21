import { LanguageIdentifier } from "../resources/language";

import { Tariff, UserTariff } from ".";
import {
  fetch204ToNull,
  fetchEnsureOk,
  fetchJsonEnsureOk,
  postJsonEnsureOk,
} from "./fetch";
import {
  tariffsUrl,
  JWT_CURRENT_TARIFF_URL,
  JWT_TOGGLE_TARIFF_RENEWAL_URL,
} from "./urls";

/** Activates tariff auto-reneval. */
export const activateAutoRenewal = () =>
  fetchEnsureOk(JWT_TOGGLE_TARIFF_RENEWAL_URL, { method: "post" });

/**
 * Books the tariff with the given ID.
 *
 * @param tariffId the ID of the tariff to book.
 */
export const bookTariff = (tariffId: number) =>
  postJsonEnsureOk(JWT_CURRENT_TARIFF_URL, { tariffId }, "put");

/** Deactivates tariff auto-reneval. */
export const deactivateAutoRenewal = () =>
  fetchEnsureOk(JWT_TOGGLE_TARIFF_RENEWAL_URL, { method: "delete" });

/** Fetches the tariff of the currently signed in user. */
export const getCurrentTariff = (): Promise<UserTariff | null> =>
  fetch204ToNull(JWT_CURRENT_TARIFF_URL);

/** Fetches all tariffs. */
export const getTariffs = (lang: LanguageIdentifier): Promise<Tariff[]> =>
  fetchJsonEnsureOk(tariffsUrl(lang));

import { Address } from '../model/stations';

/**
 * Convert the given address struct to a human-readable address with
 * non-breaking spaces between the relevant parts.
 */
export const asHumanReadable = (addr: Address) =>
  `${addr.streetAndHousenumber.replace(/ /g, '\u00a0')}, ${addr.zip}\u00a0${addr.city}`;

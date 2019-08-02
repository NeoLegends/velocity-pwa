import { Address } from '../model';

/**
 * Convert the given address struct to a human-readable address with
 * non-breaking spaces between the relevant parts.
 */
export const asHumanReadable = (addr: Address) => {
  const sanitizedAddress = addr.streetAndHousenumber.replace(/\s/g, '\u00a0');
  return `${sanitizedAddress} ${addr.zip}\u00a0${addr.city}`;
};

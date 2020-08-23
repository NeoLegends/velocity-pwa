import { Address, Customer, SepaMandate } from ".";
import { fetch204ToNull, postJsonEnsureOk } from "./fetch";
import {
  JWT_CHANGE_ADDRESS_URL,
  JWT_CHANGE_PIN_URL,
  JWT_CHANGE_TEL_URL,
  JWT_CUSTOMER_URL,
  JWT_PASSWORD_RESET_REQUEST_URL,
  JWT_SEPA_MANDATE_URL,
} from "./urls";

/**
 * Changes the address of the currently signed in customer.
 *
 * @param addr the new address.
 */
export const changeAddress = (addr: Address) =>
  postJsonEnsureOk(JWT_CHANGE_ADDRESS_URL, addr, "put");

/**
 * Changes the card PIN of the currently signed in customer.
 *
 * @param cardPin the new card PIN
 * @param password the current password of the user
 */
export const changePin = (cardPin: string, password: string) =>
  postJsonEnsureOk(JWT_CHANGE_PIN_URL, { cardPin, password }, "put");

/**
 * Changes the phone number of the currently signed in user.
 *
 * @param phoneNumber the new phone number
 */
export const changeTel = (phoneNumber: string) =>
  postJsonEnsureOk(JWT_CHANGE_TEL_URL, { phoneNumber }, "put");

/** Fetches the currently signed in customer. */
export const getCustomer = (): Promise<Customer | null> =>
  fetch204ToNull(JWT_CUSTOMER_URL);

/** Fetches the sepa info of the currently signed in user. */
export const getSepaInfo = (): Promise<SepaMandate | null> =>
  fetch204ToNull(JWT_SEPA_MANDATE_URL);

/**
 * Requests a password-reset E-Mail for the currently signed in user.
 *
 * @param login the email address of the user to request a reset email for.
 */
export const requestPasswordResetEmail = (login: string) =>
  postJsonEnsureOk(JWT_PASSWORD_RESET_REQUEST_URL, { login });

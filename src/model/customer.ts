import { Address, Customer, SepaMandate } from '.';
import { fetch204ToNull, postJsonEnsureOk } from './fetch';
import {
  APP_CHANGE_ADDRESS_URL,
  APP_CHANGE_PIN_URL,
  APP_CHANGE_TEL_URL,
  APP_CUSTOMER_URL,
  APP_PASSWORD_RESET_REQUEST_URL,
  APP_SEPA_MANDATE_URL,
} from './urls';

export const changeAddress = (addr: Address) =>
  postJsonEnsureOk(APP_CHANGE_ADDRESS_URL, addr, 'put');

export const changePin = (cardPin: string, password: string) =>
  postJsonEnsureOk(APP_CHANGE_PIN_URL, { cardPin, password }, 'put');

export const changeTel = (phoneNumber: string) =>
  postJsonEnsureOk(APP_CHANGE_TEL_URL, { phoneNumber }, 'put');

export const getCustomer = (): Promise<Customer | null> =>
  fetch204ToNull(APP_CUSTOMER_URL);

export const getSepaInfo = (): Promise<SepaMandate | null> =>
  fetch204ToNull(APP_SEPA_MANDATE_URL);

export const requestPasswordResetEmail = (login: string) =>
  postJsonEnsureOk(APP_PASSWORD_RESET_REQUEST_URL, { login });

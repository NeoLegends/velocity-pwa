import { Address, Customer, SepaMandate } from '.';
import { fetch204ToNull, fetchEnsureOk } from './fetch';
import {
  APP_CHANGE_ADDRESS_URL,
  APP_CHANGE_PIN_URL,
  APP_CHANGE_TEL_URL,
  APP_CUSTOMER_URL,
  APP_PASSWORD_RESET_REQUEST_URL,
  APP_SEPA_MANDATE_URL,
} from './urls';

export const changeAddress = (addr: Address) =>
  fetchEnsureOk(APP_CHANGE_ADDRESS_URL, {
    body: JSON.stringify(addr),
    headers: { 'Content-Type': 'application/json' },
    method: 'put',
  });

export const changePin = (cardPin: string, password: string) =>
  fetchEnsureOk(APP_CHANGE_PIN_URL, {
    body: JSON.stringify({ cardPin, password }),
    headers: { 'Content-Type': 'application/json' },
    method: 'put',
  });

export const changeTel = (phoneNumber: string) =>
  fetchEnsureOk(APP_CHANGE_TEL_URL, {
    body: JSON.stringify({ phoneNumber }),
    headers: { 'Content-Type': 'application/json' },
    method: 'put',
  });

export const getCustomer = (): Promise<Customer | null> =>
  fetch204ToNull(APP_CUSTOMER_URL);

export const getSepaInfo = (): Promise<SepaMandate | null> =>
  fetch204ToNull(APP_SEPA_MANDATE_URL);

export const requestPasswordResetEmail = (login: string) =>
  fetchEnsureOk(APP_PASSWORD_RESET_REQUEST_URL, {
    body: JSON.stringify({ login }),
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
  });

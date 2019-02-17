import classNames from 'classnames';
import { isValidIBAN } from 'ibantools';
import React, { useContext, useState } from 'react';

import { BankDetails } from '../../model';
import { LanguageContext } from '../../resources/language';

import './change-bank-details.scss';

interface ChangeBankDetailsProps {
  className?: string;

  onCancel: React.MouseEventHandler;
  onChangeBankDetails: (newBankDetails: BankDetails) => void;
}

const ChangeBankDetails: React.FC<ChangeBankDetailsProps> = ({
  className,

  onCancel,
  onChangeBankDetails,
}) => {
  const [bankName, setBankName] = useState('');
  const [bic, setBic] = useState('');
  const [iban, setIban] = useState('');
  const [mandateChecked, setMandateChecked] = useState(false);

  const { customer, PARTICULARS } = useContext(LanguageContext);

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    onChangeBankDetails({ bankName, bic, iban });
  };

  const canSubmit = Boolean(
    bankName &&
    bic &&
    mandateChecked &&
    isValidIBAN(iban),
  );

  return (
    <form
      className={classNames('change-bank-details box', className)}
      onSubmit={handleSubmit}
    >
      <h2>{PARTICULARS.MODAL.BANK_ACC.TITLE}</h2>

      <div className="wrapper">
        <h3>
          {PARTICULARS.MODAL.BANK_ACC.INPUT.IBAN}, {
            PARTICULARS.MODAL.BANK_ACC.INPUT.BANK_NAME} & {
            PARTICULARS.MODAL.BANK_ACC.INPUT.BIC}
        </h3>

        <input
          className="input outline"
          placeholder={PARTICULARS.MODAL.BANK_ACC.INPUT.IBAN}
          type="text"
          onChange={ev => setIban(ev.target.value)}
          value={iban}
        />
        <input
          className="input outline"
          placeholder={PARTICULARS.MODAL.BANK_ACC.INPUT.BANK_NAME}
          type="text"
          onChange={ev => setBankName(ev.target.value)}
          value={bankName}
        />
        <input
          className="input outline"
          placeholder={PARTICULARS.MODAL.BANK_ACC.INPUT.BIC}
          type="text"
          onChange={ev => setBic(ev.target.value)}
          value={bic}
        />

        <h3>{PARTICULARS.MODAL.BANK_ACC.SEPA.SUBTITLE}</h3>

        <p>
          {PARTICULARS.MODAL.BANK_ACC.SEPA.MANDATE.ADDRESS.NAME}<br/>
          {PARTICULARS.MODAL.BANK_ACC.SEPA.MANDATE.ADDRESS.STREET}<br/>
          {PARTICULARS.MODAL.BANK_ACC.SEPA.MANDATE.ADDRESS.ZIP_CITY}<br/>
          {PARTICULARS.MODAL.BANK_ACC.SEPA.MANDATE.ADDRESS.ID_NR}
        </p>
        <p>{PARTICULARS.MODAL.BANK_ACC.SEPA.MANDATE.SECTION_1}</p>
        <p>{PARTICULARS.MODAL.BANK_ACC.SEPA.MANDATE.SECTION_2}</p>
        <p>{PARTICULARS.MODAL.BANK_ACC.SEPA.MANDATE.SECTION_3}</p>

        <label>
          <input
            className="input"
            type="checkbox"
            checked={mandateChecked}
            onChange={ev => setMandateChecked(ev.target.checked)}
          />
          <span>{customer.ACCEPT}</span>
        </label>
      </div>

      <div className="actions">
        <button
          type="submit"
          className="btn outline"
          disabled={!canSubmit}
        >
          {PARTICULARS.MODAL.BANK_ACC.BUTTON.SUBMIT}
        </button>

        <button
          className="btn outline"
          onClick={onCancel}
        >
          {PARTICULARS.MODAL.BANK_ACC.BUTTON.CANCEL}
        </button>
      </div>
    </form>
  );
};

export default ChangeBankDetails;

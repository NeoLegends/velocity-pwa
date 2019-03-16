import classNames from 'classnames';
import { isValidIBAN } from 'ibantools';
import React, { useContext } from 'react';

import { useCheckboxField, useFormField } from '../../hooks/form';
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
  const [bankName, handleBankNameChange] = useFormField('');
  const [bic, handleBicChange] = useFormField('');
  const [iban, handleIbanChange] = useFormField('');
  const [mandateChecked, handleMandateCheckedChange] = useCheckboxField(false);

  const { customer, PARTICULARS } = useContext(LanguageContext);

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    onChangeBankDetails({ bankName, bic, iban });
  };

  const canSubmit = Boolean(
    bankName && bic && mandateChecked && isValidIBAN(iban),
  );

  return (
    <form
      className={classNames('change-bank-details box', className)}
      onSubmit={handleSubmit}
    >
      <h2>{PARTICULARS.MODAL.BANK_ACC.TITLE}</h2>

      <div className="wrapper">
        <h3>
          {PARTICULARS.MODAL.BANK_ACC.INPUT.IBAN},{' '}
          {PARTICULARS.MODAL.BANK_ACC.INPUT.BANK_NAME} &{' '}
          {PARTICULARS.MODAL.BANK_ACC.INPUT.BIC}
        </h3>

        <input
          className="input outline"
          placeholder={PARTICULARS.MODAL.BANK_ACC.INPUT.IBAN}
          type="text"
          onChange={handleIbanChange}
          value={iban}
        />
        <input
          className="input outline"
          placeholder={PARTICULARS.MODAL.BANK_ACC.INPUT.BANK_NAME}
          type="text"
          onChange={handleBankNameChange}
          value={bankName}
        />
        <input
          className="input outline"
          placeholder={PARTICULARS.MODAL.BANK_ACC.INPUT.BIC}
          type="text"
          onChange={handleBicChange}
          value={bic}
        />

        <h3>{PARTICULARS.MODAL.BANK_ACC.SEPA.SUBTITLE}</h3>

        <p>
          {PARTICULARS.MODAL.BANK_ACC.SEPA.MANDATE.ADDRESS.NAME}
          <br />
          {PARTICULARS.MODAL.BANK_ACC.SEPA.MANDATE.ADDRESS.STREET}
          <br />
          {PARTICULARS.MODAL.BANK_ACC.SEPA.MANDATE.ADDRESS.ZIP_CITY}
          <br />
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
            onChange={handleMandateCheckedChange}
          />
          <span>{customer.ACCEPT}</span>
        </label>
      </div>

      <div className="actions">
        <button type="submit" className="btn outline" disabled={!canSubmit}>
          {PARTICULARS.MODAL.BANK_ACC.BUTTON.SUBMIT}
        </button>

        <button className="btn outline" onClick={onCancel}>
          {PARTICULARS.MODAL.BANK_ACC.BUTTON.CANCEL}
        </button>
      </div>
    </form>
  );
};

export default ChangeBankDetails;

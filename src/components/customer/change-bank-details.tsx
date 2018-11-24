import { RouteComponentProps } from '@reach/router';
import { isValidIBAN } from 'ibantools';
import React from 'react';

import { BankDetails } from '../../model';
import { LanguageContext } from '../../resources/language';

import './change-bank-details.scss';

interface ChangeBankDetailsProps {
  onCancel: React.MouseEventHandler;
  onChangeBankDetails: (newBankDetails: BankDetails) => void;
}

interface ChangeBankDetailsState extends BankDetails {
  mandateChecked: boolean;
}

interface ChangeBankDetailsBodyProps extends ChangeBankDetailsState {
  canSubmit: boolean;

  onCancel: React.MouseEventHandler;
  onBankNameChange: React.ChangeEventHandler;
  onBicChange: React.ChangeEventHandler;
  onIbanChange: React.ChangeEventHandler;
  onMandateChange: React.ChangeEventHandler;
  onSubmit: React.FormEventHandler;
}

const ChangeBankDetailsBody: React.FC<ChangeBankDetailsBodyProps> = ({
  canSubmit,
  bankName,
  bic,
  iban,
  mandateChecked,

  onCancel,
  onBankNameChange,
  onBicChange,
  onIbanChange,
  onMandateChange,
  onSubmit,
}) => (
  <LanguageContext.Consumer>
    {({ customer, PARTICULARS }) => (
      <form className="change-bank-details box" onSubmit={onSubmit}>
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
            onChange={onIbanChange}
            value={iban}
          />
          <input
            className="input outline"
            placeholder={PARTICULARS.MODAL.BANK_ACC.INPUT.BANK_NAME}
            type="text"
            onChange={onBankNameChange}
            value={bankName}
          />
          <input
            className="input outline"
            placeholder={PARTICULARS.MODAL.BANK_ACC.INPUT.BIC}
            type="text"
            onChange={onBicChange}
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
              onChange={onMandateChange}
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
    )}
  </LanguageContext.Consumer>
);

class ChangeBankDetails extends React.Component<
  ChangeBankDetailsProps & RouteComponentProps,
  ChangeBankDetailsState
> {
  state = {
    bankName: '',
    bic: '',
    iban: '',
    mandateChecked: false,
  };

  render() {
    const canSubmit = Boolean(
      this.state.bankName &&
      this.state.bic &&
      this.state.mandateChecked &&
      isValidIBAN(this.state.iban),
    );

    return (
      <ChangeBankDetailsBody
        {...this.state}
        canSubmit={canSubmit}
        onCancel={this.props.onCancel}
        onBankNameChange={this.handleBankNameChange}
        onBicChange={this.handleBicChange}
        onIbanChange={this.handleIbanChange}
        onMandateChange={this.handleMandateChange}
        onSubmit={this.handleSubmit}
      />
    );
  }

  private handleBankNameChange = (ev: React.ChangeEvent<HTMLSelectElement>) =>
    this.setState({ bankName: ev.target.value })

  private handleBicChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ bic: ev.target.value })

  private handleIbanChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ iban: ev.target.value })

  private handleMandateChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ mandateChecked: ev.target.checked })

  private handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    this.props.onChangeBankDetails(this.state);
  }
}

export default ChangeBankDetails;

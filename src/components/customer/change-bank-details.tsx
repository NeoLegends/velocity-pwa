import { RouteComponentProps } from '@reach/router';
import { isValidIBAN } from 'ibantools';
import React from 'react';

import { BankDetails } from '../../model';

import './change-bank-details.scss';

interface ChangeBankDetailsProps {
  onCancel: React.MouseEventHandler;
  onChangeBankDetails: (newBankDetails: BankDetails) => void;
}

interface ChangeBankDetailsState extends BankDetails {
  mandateChecked: boolean;
}

interface BodyProps extends ChangeBankDetailsState {
  canSubmit: boolean;

  onCancel: React.MouseEventHandler;
  onBankNameChange: React.ChangeEventHandler;
  onBicChange: React.ChangeEventHandler;
  onIbanChange: React.ChangeEventHandler;
  onMandateChange: React.ChangeEventHandler;
  onSubmit: React.FormEventHandler;
}

const Body: React.FC<BodyProps> = ({
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
  <form className="change-bank-details box" onSubmit={onSubmit}>
    <h2>Bankdaten ändern</h2>

    <div className="wrapper">
      <h3>Bankdaten</h3>

      <input
        className="input outline"
        placeholder="IBAN"
        type="text"
        onChange={onIbanChange}
        value={iban}
      />
      <input
        className="input outline"
        placeholder="Name der Bank"
        type="text"
        onChange={onBankNameChange}
        value={bankName}
      />
      <input
        className="input outline"
        placeholder="BIC"
        type="text"
        onChange={onBicChange}
        value={bic}
      />

      <h3>SEPA-Mandat</h3>

      <p>
        Velocity Aachen GmbH<br/>
        Kockerellstraße 19<br/>
        52062 Aachen<br/>
        Gläubiger-Identifikationsnummer: DE27ZZZ00001598043
      </p>
      <p>
        Ich ermächtige Velocity Aachen GmbH, Zahlungen von meinem Konto
        mittels Lastschrift einzuziehen. Zugleich weise ich mein Kreditinstitut
        an, die von Velocity Aachen GmbH auf mein Konto gezogenen Lastschriften
        einzulösen.
      </p>
      <p>
        Ich kann innerhalb von acht Wochen, beginnend mit dem Belastungsdatum,
        die Erstattung des belasteten Betrages verlangen. Es gelten dabei die mit
        meinem Kreditinstitut vereinbarten Bedingungen.
      </p>
      <p>
        Desweiteren nehme ich zur Kenntnis, dass mir die Mandatsreferenznummer gesondert,
        mit Erhalt der ersten Rechnung, zugestellt wird.
      </p>

      <label>
        <input
          className="input"
          type="checkbox"
          checked={mandateChecked}
          onChange={onMandateChange}
        />
        <span>Akzeptieren</span>
      </label>
    </div>

    <div className="actions">
      <button
        type="submit"
        className="btn outline"
        disabled={!canSubmit}
      >
        Bankdaten ändern
      </button>

      <button
        className="btn outline"
        onClick={onCancel}
      >
        Abbrechen
      </button>
    </div>
  </form>
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
      <Body
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

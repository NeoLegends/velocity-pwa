import { RouteComponentProps } from '@reach/router';
import React from 'react';

import { SepaMandate } from '../../model';

interface ChangePasswordProps {
  mandate: SepaMandate;

  onCancel: React.MouseEventHandler;
}

const ChangePassword: React.FC<ChangePasswordProps & RouteComponentProps> = ({
  mandate,

  onCancel,
}) => (
  <div className="change-pw box">
    <h2>SEPA-Lastschriftmandat</h2>

    <div className="wrapper">
      <p>Referenz: {mandate.reference}</p>
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
        Desweiteren nehme ich zur Kenntnis, dass mir die Mandatsreferenznummer
        gesondert, mit Erhalt der ersten Rechnung, zugestellt wird.
      </p>

      <p>
        {mandate.firstname} {mandate.lastname}<br/>
        {mandate.address.streetAndHousenumber}<br/>
        {mandate.address.zip} {mandate.address.city}<br/>
        {mandate.iban}<br/>
        {mandate.bankName} | {mandate.bic}
      </p>
    </div>

    <div className="actions">
      <button
        className="btn outline"
        onClick={onCancel}
      >
        Zurück
      </button>
    </div>
  </div>
);

export default ChangePassword;

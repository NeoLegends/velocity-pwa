import { RouteComponentProps } from '@reach/router';
import React from 'react';

import { SepaMandate } from '../../model';
import { LanguageContext } from '../../util/language';

interface SepaMandateProps {
  mandate: SepaMandate;

  onCancel: React.MouseEventHandler;
}

const SepaMandateBody: React.FC<SepaMandateProps & RouteComponentProps> = ({
  mandate,

  onCancel,
}) => (
  <LanguageContext.Consumer>
    {({ SEPA }) => (
      <div className="change-pw box">
        <h2>{SEPA.SUBTITLE}</h2>

        <div className="wrapper">
          <p>{SEPA.MANDATE.MANDATE_REF}: {mandate.reference}</p>
          <p>
            {SEPA.MANDATE.ADDRESS.NAME}<br/>
            {SEPA.MANDATE.ADDRESS.STREET}<br/>
            {SEPA.MANDATE.ADDRESS.ZIP_CITY}<br/>
            {SEPA.MANDATE.ADDRESS.ID_NR}
          </p>
          <p>{SEPA.MANDATE.SECTION_1}</p>
          <p>{SEPA.MANDATE.SECTION_2}</p>

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
    )}
  </LanguageContext.Consumer>
);

export default SepaMandateBody;

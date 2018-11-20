import { Link, RouteComponentProps } from '@reach/router';
import React from 'react';

import { Customer, SepaMandate } from '../../model';

interface CustomerBodyProps {
  customer: Customer;
  sepaMandate: SepaMandate;
}

const Overview: React.FC<CustomerBodyProps & RouteComponentProps> = ({
  customer,
  sepaMandate,
}) => (
  <>
    <div className="box personal">
      <h2>Persönliche Daten</h2>

      <div className="wrapper">
        <table>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{customer.firstname} {customer.lastname}</td>
            </tr>
            <tr>
              <td>Straße</td>
              <td>{customer.address.streetAndHousenumber}</td>
            </tr>
            <tr>
              <td>PLZ</td>
              <td>{customer.address.zip}</td>
            </tr>
            <tr>
              <td>Stadt</td>
              <td>{customer.address.city}</td>
            </tr>
            <tr>
              <td>Land</td>
              <td>{customer.address.country}</td>
            </tr>
            <tr>
              <td>E-Mail</td>
              <td>{customer.login}</td>
            </tr>
            <tr>
              <td>Tel. Nummer</td>
              <td>{customer.phonenumber || "Nicht gesetzt"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="actions">
        <Link
          className="btn outline"
          to="change-address"
        >
          Anschrift ändern
        </Link>

        <Link
          className="btn outline"
          to="change-pin"
        >
          PIN ändern
        </Link>

        <Link
          className="btn outline"
          to="change-password"
        >
          Passwort ändern
        </Link>

        <Link
          className="btn outline"
          to="change-tel"
        >
          Telefonnummer {customer.phonenumber ? "ändern" : "eintragen"}
        </Link>
      </div>
    </div>

    <div className="box banking">
      <h2>Bankdaten</h2>

      <div className="wrapper">
        <table>
          <tbody>
            <tr>
              <td>Kontoinhaber</td>
              <td>{sepaMandate.firstname} {sepaMandate.lastname}</td>
            </tr>
            <tr>
              <td>IBAN</td>
              <td>{sepaMandate.iban}</td>
            </tr>
            <tr>
              <td>Bank</td>
              <td>{sepaMandate.bankName} | {sepaMandate.bic}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="actions">
        <Link
          className="btn outline"
          to="change-bank-details"
        >
          Bankdaten ändern
        </Link>

        <Link
          className="btn outline"
          to="sepa-mandate"
        >
          SEPA-Mandat abrufen
        </Link>
      </div>
    </div>
  </>
);

export default Overview;

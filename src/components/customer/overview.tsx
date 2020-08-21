import { Link, RouteComponentProps } from "@reach/router";
import classNames from "clsx";
import React, { useContext } from "react";

import { Customer, SepaMandate } from "../../model";
import { LanguageContext } from "../../resources/language";

interface CustomerBodyProps {
  className?: string;
  customer: Customer;
  sepaMandate: SepaMandate;
}

const Overview: React.FC<CustomerBodyProps & RouteComponentProps> = ({
  className,
  customer,
  sepaMandate,
}) => {
  const { customer: cust, PARTICULARS } = useContext(LanguageContext);

  return (
    <>
      <div className={classNames("box personal", className)}>
        <h2>{PARTICULARS.HEADING}</h2>

        <div className="wrapper">
          <table>
            <tbody>
              <tr>
                <td>{PARTICULARS.TABLE.NAME}</td>
                <td>
                  {customer.firstname} {customer.lastname}
                </td>
              </tr>
              <tr>
                <td>{PARTICULARS.TABLE.STREET}</td>
                <td>{customer.address.streetAndHousenumber}</td>
              </tr>
              <tr>
                <td>{PARTICULARS.TABLE.ZIP}</td>
                <td>{customer.address.zip}</td>
              </tr>
              <tr>
                <td>{PARTICULARS.TABLE.CITY}</td>
                <td>{customer.address.city}</td>
              </tr>
              <tr>
                <td>{PARTICULARS.TABLE.COUNTRY}</td>
                <td>{customer.address.country}</td>
              </tr>
              <tr>
                <td>{PARTICULARS.TABLE.LOGIN}</td>
                <td>{customer.login}</td>
              </tr>
              <tr>
                <td>{PARTICULARS.TABLE.PHONE}</td>
                <td>{customer.phonenumber || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="actions">
          <Link className="btn outline" to="change-address">
            {PARTICULARS.TABLE.CHANGE_ADDRESS}
          </Link>

          <Link className="btn outline" to="change-pin">
            {PARTICULARS.PANEL.PIN}
          </Link>

          <Link className="btn outline" to="change-password">
            {PARTICULARS.PANEL.PASSWORD}
          </Link>

          <Link className="btn outline" to="change-tel">
            {PARTICULARS.TABLE.CHANGE_PHONE}
          </Link>
        </div>
      </div>

      <div className="box banking">
        <h2>{cust.BANK_DETAILS.BANK_DETAILS}</h2>

        <div className="wrapper">
          <table>
            <tbody>
              <tr>
                <td>{cust.BANK_DETAILS.ACCOUNT_OWNER}</td>
                <td>
                  {sepaMandate.firstname} {sepaMandate.lastname}
                </td>
              </tr>
              <tr>
                <td>{PARTICULARS.MODAL.BANK_ACC.INPUT.IBAN}</td>
                <td>{sepaMandate.iban}</td>
              </tr>
              <tr>
                <td>
                  {PARTICULARS.MODAL.BANK_ACC.INPUT.BANK_NAME} &{" "}
                  {PARTICULARS.MODAL.BANK_ACC.INPUT.BIC}
                </td>
                <td>
                  {sepaMandate.bankName} | {sepaMandate.bic}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="actions">
          <Link className="btn outline" to="change-bank-details">
            {PARTICULARS.PANEL.BANK_ACC}
          </Link>

          <Link className="btn outline" to="sepa-mandate">
            {PARTICULARS.PANEL.SEPA}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Overview;

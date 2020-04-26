import classNames from "classnames";
import React, { useContext } from "react";

import { useInvoices } from "../hooks/invoices";
import { invoiceUrl } from "../model/urls";
import { LanguageContext, LanguageIdContext } from "../resources/language";
import { toEuro } from "../util/to-euro";

import "./invoices.scss";

interface InvoicesProps {
  className?: string;
}

const Invoices: React.FC<InvoicesProps> = ({ className }) => {
  const { BILL } = useContext(LanguageContext);
  const langId = useContext(LanguageIdContext);
  const invoices = useInvoices();

  return (
    <div className={classNames("invoices box-list", className)}>
      {!invoices.length && (
        <div className="note info">{BILL.ALERT.NO_INVOICES}</div>
      )}

      {invoices.length && (
        <div className="box">
          <h2>{BILL.HEADLINE}</h2>

          <table>
            <thead>
              <tr>
                <th>{BILL.HEAD.JAHR}</th>
                <th>{BILL.HEAD.MONAT}</th>
                <th>{BILL.HEAD.SUM}</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const urlParts = inv.url.split("/");
                const invName = urlParts[urlParts.length - 1];
                const monthName = new Date(
                  inv.year,
                  inv.month - 1,
                ).toLocaleDateString(langId, { month: "long" });

                return (
                  <tr key={inv.url}>
                    <td>{inv.year}</td>
                    <td>{monthName}</td>
                    <td>{toEuro(inv.sum)}</td>
                    <td>
                      <a
                        href={invoiceUrl(invName)}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {invName}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Invoices;

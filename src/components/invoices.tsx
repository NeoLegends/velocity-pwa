import classNames from 'classnames';
import React, { useContext } from 'react';

import { useInvoices } from '../hooks/invoices';
import { LanguageContext } from '../resources/language';

import './invoices.scss';

interface InvoicesProps {
  className?: string;
}

const Invoices: React.FC<InvoicesProps> = ({ className }) => {
  const { BILL } = useContext(LanguageContext);
  const invoices = useInvoices();

  return (
    <div className={classNames('invoices box-list', className)}>
      {!invoices.length && (
        <div className="note info">
          {BILL.ALERT.NO_INVOICES}
        </div>
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
              {invoices.map(inv => {
                const urlParts = inv.url.split('/');
                const invName = urlParts[urlParts.length - 1];

                return (
                  <tr key={inv.url}>
                    <td>{inv.year}</td>
                    <td>{inv.month}</td>
                    <td>{inv.sum.toEuro()}</td>
                    <td>
                      <a href={inv.url} target="_blank">{invName}</a>
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

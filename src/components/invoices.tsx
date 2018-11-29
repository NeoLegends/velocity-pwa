import React from 'react';
import { toast } from 'react-toastify';

import { Invoice } from '../model';
import { getAllInvoices } from '../model/invoices';
import { LanguageContext } from '../resources/language';

import './invoices.scss';

interface InvoicesState {
  invoices: Invoice[];
}

const InvoicesBody: React.FC<InvoicesState> = ({ invoices }) => (
  <LanguageContext.Consumer>
    {({ BILL }) => (
      <div className="invoices box-list">
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
    )}
  </LanguageContext.Consumer>
);

class Invoices extends React.Component<{}, InvoicesState> {
  static contextType = LanguageContext;

  context!: React.ContextType<typeof LanguageContext>;
  state = {
    invoices: [],
  };

  componentDidMount() {
    this.fetchInvoices();
  }

  render() {
    return <InvoicesBody {...this.state}/>;
  }

  private async fetchInvoices() {
    try {
      const invoices = await getAllInvoices();
      this.setState({ invoices });
    } catch (err) {
      toast(
        this.context.BILL.ALERT.FETCH_INVOICE_FAILURE,
        { type: 'error' },
      );
    }
  }
}

export default Invoices;

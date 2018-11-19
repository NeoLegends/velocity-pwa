import React from 'react';

import { Invoice } from '../model';
import { getAllInvoices } from '../model/invoices';

import './invoices.scss';

interface InvoicesState {
  invoices: Invoice[];
}

const InvoicesBody: React.FC<InvoicesState> = ({ invoices }) => (
  <div className="invoices box-list">
    {!invoices.length && (
      <div className="note info">
        Es liegen noch keine Rechnungen für Sie vor.
      </div>
    )}

    {invoices.length && (
      <div className="box">
        <h2>Rechnungen</h2>

        <table>
          <thead>
            <tr>
              <th>Jahr</th>
              <th>Monat</th>
              <th>Summe</th>
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

class Invoices extends React.Component<{}, InvoicesState> {
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
    const invoices = await getAllInvoices();
    this.setState({ invoices });
  }
}

export default Invoices;

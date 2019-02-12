import { useContext, useDebugValue, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Invoice } from '../model';
import { getAllInvoices } from '../model/invoices';
import { LanguageContext } from '../resources/language';

export const useInvoices = () => {
  const { BILL } = useContext(LanguageContext);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useDebugValue(invoices);

  useEffect(() => {
    getAllInvoices()
      .then(setInvoices)
      .catch(err => {
        console.error("Error while loading the invoices:", err);
        toast(
          BILL.ALERT.FETCH_INVOICE_FAILURE,
          { type: 'error' },
        );
      });
  }, []);

  return invoices;
};

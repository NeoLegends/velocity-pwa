import { useContext, useEffect, useState } from "react";

import { Invoice } from "../model";
import { getAllInvoices } from "../model/invoices";
import { LanguageContext } from "../resources/language";
import { toast } from "../util/toast";

export const useInvoices = () => {
  const { BILL } = useContext(LanguageContext);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    getAllInvoices()
      .then(setInvoices)
      .catch((err) => {
        console.error("Error while loading the invoices:", err);
        toast(BILL.ALERT.FETCH_INVOICE_FAILURE, { type: "error" });
      });
  }, [BILL]);

  return invoices;
};

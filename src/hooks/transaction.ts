import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Transaction } from '../model';
import { getTransactions } from '../model/transaction';
import { LanguageContext } from '../resources/language';

const TRANSACTIONS_PER_PAGE = 20;

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const { BUCHUNGEN } = useContext(LanguageContext);
  const loadNextPage = useCallback(
    ({ startIndex = 0 }: { startIndex: number }) => {
      setIsNextPageLoading(true);
      const page = Math.floor(startIndex / TRANSACTIONS_PER_PAGE);

      return getTransactions(page)
        .then(trans => {
          setTransactions(existingTrans => [...existingTrans, ...trans]);
          setHasNextPage(trans.length >= TRANSACTIONS_PER_PAGE);
        })
        .catch(err => {
          console.error('Failed loading transactions:', err);
          toast(BUCHUNGEN.ALERT.REFRESH_TRANSACTION_HISTORY, { type: 'error' });
        })
        .finally(() => setIsNextPageLoading(false));
    },
    [BUCHUNGEN],
  );

  useEffect(() => {
    loadNextPage({ startIndex: 0 });
  }, []);

  return {
    hasNextPage,
    isNextPageLoading,
    loadNextPage,
    transactions,
  };
};

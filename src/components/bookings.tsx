import classNames from 'classnames';
import React, { useCallback, useContext } from 'react';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';

import { useTransactions } from '../hooks/transaction';
import { Transaction } from '../model';
import { LanguageContext, LanguageIdContext } from '../resources/language';
import moment from '../util/moment';

import './bookings.scss';

interface BookingsProps {
  className?: string;
}

interface TransactionProps {
  style: any;
  transaction: Transaction;
}

const startDateFormattingOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const Trans: React.SFC<TransactionProps> = ({ style, transaction }) => {
  const language = useContext(LanguageIdContext);
  const { BUCHUNGEN, SUPPORT } = useContext(LanguageContext);

  const startDate = new Date(transaction.startDateTime);
  const endDate = new Date(transaction.endDateTime);

  return (
    <div className="gap" style={style}>
      <div className="transaction outline">
        <p className="oneline">
          {startDate.toLocaleDateString(undefined, startDateFormattingOptions)}
        </p>
        <p className="sentence">
          {BUCHUNGEN.HISTORIE.STATION_PANEL.STATION.FROM}{' '}
          {transaction.fromStation.name.replace(/\s/g, '\u00A0')}{' '}
          {BUCHUNGEN.HISTORIE.STATION_PANEL.STATION.TO}{' '}
          {transaction.toStation.name.replace(/\s/g, '\u00A0')}{' '}
          {moment(endDate, undefined, language).from(startDate, false)}
        </p>
        <p className="oneline">
          {SUPPORT.ERROR_REPORT.BIKE.BIKE_ID}:{' '}
          {transaction.pedelecName.replace(/\_[nN]/g, '')}
        </p>
      </div>
    </div>
  );
};

const noop = () => Promise.resolve();

const Bookings: React.SFC<BookingsProps> = ({ className }) => {
  const {
    hasNextPage,
    isNextPageLoading,
    loadNextPage,
    transactions,
  } = useTransactions();

  const { BUCHUNGEN } = useContext(LanguageContext);

  const isRowLoaded = useCallback(
    ({ index }) => !hasNextPage || index < transactions.length,
    [hasNextPage, transactions.length],
  );

  const renderRow = useCallback(
    ({ index, key, style }) =>
      isRowLoaded({ index }) ? (
        <Trans key={key} style={style} transaction={transactions[index]} />
      ) : (
        <div key={key} style={style}>
          Loading...
        </div>
      ),
    [isRowLoaded, transactions],
  );

  return (
    <div className={classNames('bookings box-list', className)}>
      <div className="box transactions">
        <h2>{BUCHUNGEN.HISTORIE.TITEL}</h2>

        <div className="wrapper">
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={!isNextPageLoading ? loadNextPage : noop}
            minimumBatchSize={20}
            rowCount={Infinity}
          >
            {({ onRowsRendered, registerChild }) => (
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    ref={registerChild}
                    height={height}
                    width={width}
                    onRowsRendered={onRowsRendered}
                    rowCount={transactions.length}
                    rowHeight={154}
                    rowRenderer={renderRow}
                  />
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>
        </div>
      </div>
    </div>
  );
};

export default Bookings;

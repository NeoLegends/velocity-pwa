import classNames from 'classnames';
import React, { useCallback, useContext } from 'react';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { InfiniteLoader } from 'react-virtualized/dist/es/InfiniteLoader';
import { List } from 'react-virtualized/dist/es/List';
import { WindowScroller } from 'react-virtualized/dist/es/WindowScroller';

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
        <p className="oneline">
          {BUCHUNGEN.HISTORIE.STATION_PANEL.STATION.FROM}{' '}
          {transaction.fromStation.name.replace(/\s/g, '\u00A0')}
        </p>
        <p className="oneline">
          {BUCHUNGEN.HISTORIE.STATION_PANEL.STATION.TO}{' '}
          {transaction.toStation.name.replace(/\s/g, '\u00A0')}
        </p>
        <p className="oneline">
          {SUPPORT.ERROR_REPORT.BIKE.BIKE_ID}{' '}
          {transaction.pedelecName.replace(/\_[nN]/g, '')}
          {', '}
          {moment(endDate, undefined, language).from(startDate, true)}
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
    ({ index, key, style }) => (
      <Trans key={key} style={style} transaction={transactions[index]} />
    ),
    [transactions],
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
              <WindowScroller>
                {({ height, isScrolling, onChildScroll, scrollTop }) => (
                  <AutoSizer disableHeight>
                    {({ width }) => (
                      <List
                        ref={registerChild}
                        autoHeight={true}
                        height={height}
                        width={width}
                        isScrolling={isScrolling}
                        onRowsRendered={onRowsRendered}
                        onScroll={onChildScroll}
                        rowCount={transactions.length}
                        rowHeight={170}
                        rowRenderer={renderRow}
                        scrollTop={scrollTop}
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            )}
          </InfiniteLoader>
        </div>
      </div>
    </div>
  );
};

export default Bookings;

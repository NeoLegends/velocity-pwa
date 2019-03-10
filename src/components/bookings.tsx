import { navigate } from '@reach/router';
import classNames from 'classnames';
import moment from 'moment';
import 'moment/locale/de';
import React, { useCallback, useContext, useEffect } from 'react';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';

import { useTransactions } from '../hooks/bookings';
import { useBooking } from '../hooks/map';
import { useSavedPin } from '../hooks/pin';
import { useStations } from '../hooks/stations';
import { Booking, Station, Transaction } from '../model';
import { cancelCurrentBooking } from '../model/transaction';
import { LanguageContext, LanguageIdContext } from '../resources/language';

import './bookings.scss';

interface BookingsProps {
  className?: string;
}

interface BookingProps {
  booking: Booking;
  canRentReservation: boolean;
  stations: Station[];

  onCancelReservation: React.MouseEventHandler;
  onRentReservation: React.MouseEventHandler;
}

interface TransactionProps {
  style: any;
  transaction: Transaction;
}

const BookingBox: React.SFC<BookingProps> = ({
  booking,
  canRentReservation,
  stations,

  onCancelReservation,
  onRentReservation,
}) => {
  const { BUCHUNGEN, MAP } = useContext(LanguageContext);

  const targetStation = stations.find(stat => stat.stationId === booking.stationId);

  return (
    <div className="box outline booking">
      <h2>{BUCHUNGEN.RESERVIERUNG.TITEL}</h2>

      <div className="wrapper">
        <p>{BUCHUNGEN.RESERVIERUNG.STATION}: {targetStation ? targetStation.name : 'N/A'}</p>
        <p>{BUCHUNGEN.RESERVIERUNG.SLOT}: {booking.stationSlotPosition}</p>
        <p>{BUCHUNGEN.RESERVIERUNG.ZEIT}: {(new Date(booking.expiryDateTime)).toLocaleString()}</p>
      </div>

      <div className="actions">
        <button
          className="btn outline"
          onClick={onCancelReservation}
        >
          {BUCHUNGEN.RESERVIERUNG.BUTTON}
        </button>

        <button
          className="btn outline"
          disabled={!canRentReservation}
          onClick={onRentReservation}
        >
          {MAP.POPUP.BUTTON.RENT}
        </button>
      </div>
    </div>
  );
};

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
          {startDate.toLocaleDateString(
            undefined,
            startDateFormattingOptions,
          )}
        </p>
        <p className="sentence">
          {BUCHUNGEN.HISTORIE.STATION_PANEL.STATION.FROM}
          {' '}
          {transaction.fromStation.name.replace(/\s/g, '\u00A0')}
          {' '}
          {BUCHUNGEN.HISTORIE.STATION_PANEL.STATION.TO}
          {' '}
          {transaction.toStation.name.replace(/\s/g, '\u00A0')}
          {' '}
          {moment(endDate, undefined, language).from(startDate, false)}
        </p>
        <p className="oneline">
          {SUPPORT.ERROR_REPORT.BIKE.BIKE_ID}:
          {' '}
          {transaction.pedelecName.replace(/\_[nN]/g, '')}
        </p>
      </div>
    </div>
  );
};

const noop = () => Promise.resolve();

const Bookings: React.SFC<BookingsProps> = ({ className }) => {
  const [currentBooking, fetchBooking] = useBooking();
  const [cardPin] = useSavedPin();
  const [stations] = useStations();
  const { hasNextPage, isNextPageLoading, loadNextPage, transactions } =
    useTransactions();

  const { BUCHUNGEN } = useContext(LanguageContext);

  const handleCancelReservation = useCallback(
    () => cancelCurrentBooking().then(fetchBooking),
    [],
  );
  const handleRentReservation = () => navigate(`/#${currentBooking!.stationId}`);

  useEffect(
    () => { loadNextPage({ startIndex: 0 }); },
    [],
  );

  const isRowLoaded = ({ index }) => !hasNextPage || index < transactions.length;

  const renderRow = ({ index, key, style }) => {
    if (!isRowLoaded({ index })) {
      return <div key={key} style={style}>Loading...</div>;
    }

    return (
      <Trans
        key={key}
        style={style}
        transaction={transactions[index]}
      />
    );
  };

  return (
    <div className={classNames('bookings box-list', className)}>
      {currentBooking && (
        <BookingBox
          booking={currentBooking}
          canRentReservation={Boolean(cardPin)}
          stations={stations}
          onCancelReservation={handleCancelReservation}
          onRentReservation={handleRentReservation}
        />
      )}

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

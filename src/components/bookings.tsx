import React from 'react';
import { AutoSizer, IndexRange, InfiniteLoader, List } from 'react-virtualized';
import 'react-virtualized/styles.css';

import { Booking, Station, Transaction } from '../model';
import { getAllStations } from '../model/stations';
import { getCurrentBooking, getTransactions } from '../model/transaction';

import './bookings.scss';

interface BookingsState {
  currentBooking: Booking | null;
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  stations: Station[];
  transactions: Transaction[];
}

interface BookingsBodyProps extends BookingsState {
  onCancelReservation: React.MouseEventHandler;
  onLoadNextPage: (range: IndexRange) => Promise<any>;
  onRentReservation: React.MouseEventHandler;
}

interface BookingProps {
  booking: Booking;
  stations: Station[];

  onCancelReservation: React.MouseEventHandler;
  onRentReservation: React.MouseEventHandler;
}

interface TransactionProps {
  style: any;
  transaction: Transaction;
}

const TRANSACTIONS_PER_PAGE = 20;

const BookingBox: React.SFC<BookingProps> = ({ booking, stations }) => {
  const targetStation = stations.find(stat => stat.stationId === booking.stationId);

  return (
    <div className="box outline booking">
      <h2>Aktuelle Reservierung</h2>

      <div className="wrapper">
        <p>Station: {targetStation ? targetStation.name : 'N/A'}</p>
        <p>Stellplatz: {booking.stationSlotPosition}</p>
        <p>Reserviert bis: {(new Date(booking.expiryDateTime)).toLocaleString()}</p>
      </div>
    </div>
  );
};

const Trans: React.SFC<TransactionProps> = ({ style, transaction }) => {
  const startDate = new Date(transaction.startDateTime);
  const endDate = new Date(transaction.endDateTime);

  return (
    <div className="transaction outline" style={style}>
      <p>{transaction.fromStation.name} ➡️ {transaction.toStation.name}</p>
      <p>{startDate.toLocaleString()} bis {endDate.toLocaleString()}</p>
      <p>Fahrradnummer: {transaction.pedelecName}</p>
    </div>
  );
};

const noop = () => Promise.resolve();

const BookingsBody: React.SFC<BookingsBodyProps> = ({
  currentBooking,
  hasNextPage,
  isNextPageLoading,
  stations,
  transactions,

  onCancelReservation,
  onLoadNextPage,
  onRentReservation,
}) => {
  const isRowLoaded = ({ index }) => !hasNextPage || index < transactions.length;

  const renderRow = ({ index, key, style }) => {
    if (!isRowLoaded({ index })) {
      return null;
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
    <div className="bookings">
      {currentBooking && (
        <BookingBox
          booking={currentBooking}
          stations={stations}
          onCancelReservation={onCancelReservation}
          onRentReservation={onRentReservation}
        />
      )}

      <div className="box outline transactions">
        <h2>Vergangene Fahrten</h2>

        <div className="wrapper">
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={!isNextPageLoading ? onLoadNextPage : noop}
            minimumBatchSize={20}
            rowCount={transactions.length}
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
                    rowHeight={128}
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

class Bookings extends React.Component<{}, BookingsState> {
  state = {
    currentBooking: null,
    hasNextPage: true,
    isNextPageLoading: false,
    stations: [],
    transactions: [],
  };

  componentDidMount() {
    this.fetchBookingAndStations();
  }

  render() {
    return (
      <BookingsBody
        {...this.state}
        onCancelReservation={this.handleCancelReservation}
        onLoadNextPage={this.handleLoadTransactions}
        onRentReservation={this.handleRentReservation}
      />
    );
  }

  private async fetchBookingAndStations() {
    const [currentBooking, stations] = await Promise.all([
      getCurrentBooking(),
      getAllStations(),
    ]);
    this.setState({ currentBooking, stations });
  }

  private handleCancelReservation = async () => {
    await this.fetchBookingAndStations();
  }

  private handleLoadTransactions = async ({ startIndex }) => {
    this.setState({ isNextPageLoading: true });
    const page = Math.round(startIndex / TRANSACTIONS_PER_PAGE);

    try {
      const transactions = await getTransactions(page);
      this.setState(state => ({
        hasNextPage: transactions.length >= TRANSACTIONS_PER_PAGE,
        transactions: [...state.transactions, ...transactions],
      }));
    } finally {
      this.setState({ isNextPageLoading: false });
    }
  }

  private handleRentReservation = async () => {};
}

export default Bookings;

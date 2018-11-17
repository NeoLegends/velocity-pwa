import React from 'react';
import { AutoSizer, IndexRange, InfiniteLoader, List } from 'react-virtualized';
import 'react-virtualized/styles.css';

import { Booking, Station, Transaction } from '../model';
import { getAllStations, getSlotInfo, rentBike } from '../model/stations';
import {
  cancelCurrentBooking,
  getCurrentBooking,
  getTransactions,
} from '../model/transaction';

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

const BookingBox: React.SFC<BookingProps> = ({
  booking,
  stations,

  onCancelReservation,
  onRentReservation,
}) => {
  const targetStation = stations.find(stat => stat.stationId === booking.stationId);

  return (
    <div className="box outline booking">
      <h2>Aktuelle Reservierung</h2>

      <div className="wrapper">
        <p>Station: {targetStation ? targetStation.name : 'N/A'}</p>
        <p>Stellplatz: {booking.stationSlotPosition}</p>
        <p>Reserviert bis: {(new Date(booking.expiryDateTime)).toLocaleString()}</p>
      </div>

      <div className="actions">
        <button
          className="btn outline"
          onClick={onRentReservation}
        >
          Ausleihen
        </button>
        <button
          className="btn outline"
          onClick={onCancelReservation}
        >
          Reservierung löschen
        </button>
      </div>
    </div>
  );
};

const Trans: React.SFC<TransactionProps> = ({ style, transaction }) => {
  const startDate = new Date(transaction.startDateTime);
  const endDate = new Date(transaction.endDateTime);

  return (
    <div className="gap" style={style}>
      <div className="transaction outline">
        <p>{transaction.fromStation.name} nach {transaction.toStation.name}</p>
        <p>{startDate.toLocaleString()} bis {endDate.toLocaleString()}</p>
        <p>Fahrradnummer: {transaction.pedelecName}</p>
      </div>
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
                    rowHeight={138}
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
      this.handleLoadTransactions({ startIndex: 0 }),
    ]);
    this.setState({ currentBooking, stations });
  }

  private handleCancelReservation = async () => {
    await cancelCurrentBooking();
    await this.fetchBookingAndStations();
  }

  private handleLoadTransactions = async ({ startIndex }) => {
    this.setState({ isNextPageLoading: true });
    const page = Math.floor(startIndex / TRANSACTIONS_PER_PAGE);

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

  private handleRentReservation = async () => {
    const currentBooking = (this.state as BookingsState).currentBooking;
    if (!currentBooking) {
      throw new Error("Trying to rent, but missing current booking");
    }

    const station = (this.state as BookingsState).stations
      .find(stat => stat.stationId === currentBooking.stationId);
    if (!station) {
      throw new Error("Trying to rent, but missing station");
    }

    const slots = await getSlotInfo(station.stationId);
    if (!slots) {
      throw new Error("Trying to rent, but missing slot detail");
    }

    const slot = slots.stationSlots
      .find(slot => slot.stationSlotPosition === currentBooking.stationSlotPosition);
    if (!slot) {
      throw new Error("Trying to rent, but missing slot");
    }

    await rentBike(
      null!,
      currentBooking.stationId,
      slot.stationSlotId,
    );
  }
}

export default Bookings;

import moment from 'moment';
import 'moment/locale/de';
import React from 'react';
import { toast } from 'react-toastify';
import { AutoSizer, IndexRange, InfiniteLoader, List } from 'react-virtualized';

import { Booking, Station, Transaction } from '../model';
import { getAllStations, getSavedCardPin, getSlotInfo, rentBike } from '../model/stations';
import {
  cancelCurrentBooking,
  getCurrentBooking,
  getTransactions,
} from '../model/transaction';
import { LanguageContext, LanguageIdContext } from '../resources/language';

import './bookings.scss';

interface BookingsState {
  cardPin: string | null;
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
  canRentReservation: boolean;
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
  canRentReservation,
  stations,

  onCancelReservation,
  onRentReservation,
}) => {
  const targetStation = stations.find(stat => stat.stationId === booking.stationId);

  return (
    <LanguageContext.Consumer>
      {({ BUCHUNGEN, MAP }) => (
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
      )}
    </LanguageContext.Consumer>
  );
};

const startDateFormattingOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const Trans: React.SFC<TransactionProps> = ({ style, transaction }) => {
  const startDate = new Date(transaction.startDateTime);
  const endDate = new Date(transaction.endDateTime);

  return (
    <LanguageIdContext.Consumer>
      {language => (
        <LanguageContext.Consumer>
          {({ BUCHUNGEN, SUPPORT }) => (
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
          )}
        </LanguageContext.Consumer>
      )}
    </LanguageIdContext.Consumer>
  );
};

const noop = () => Promise.resolve();

const BookingsBody: React.SFC<BookingsBodyProps> = ({
  cardPin,
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
    <LanguageContext.Consumer>
      {({ BUCHUNGEN }) => (
        <div className="bookings box-list">
          {currentBooking && (
            <BookingBox
              booking={currentBooking}
              canRentReservation={Boolean(cardPin)}
              stations={stations}
              onCancelReservation={onCancelReservation}
              onRentReservation={onRentReservation}
            />
          )}

          <div className="box transactions">
            <h2>{BUCHUNGEN.HISTORIE.TITEL}</h2>

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
      )}
    </LanguageContext.Consumer>
  );
};

class Bookings extends React.Component<{}, BookingsState> {
  static contextType = LanguageContext;

  context!: React.ContextType<typeof LanguageContext>;
  state = {
    cardPin: null,
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
    try {
      const [currentBooking, stations] = await Promise.all([
        getCurrentBooking(),
        getAllStations(),
        this.handleLoadTransactions({ startIndex: 0 }),
      ]);

      this.setState({
        cardPin: getSavedCardPin(),
        currentBooking,
        stations,
      });
    } catch (err) {
      toast(
        this.context.BUCHUNGEN.ALERT.LOAD_CURR_BOOKING_ERR,
        { type: 'error' },
      );
    }
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
    } catch (err) {
      toast(
        this.context.BUCHUNGEN.ALERT.REFRESH_TRANSACTION_HISTORY,
        { type: 'error' },
      );
    } finally {
      this.setState({ isNextPageLoading: false });
    }
  }

  private handleRentReservation = async () => {
    try {
      const { cardPin, currentBooking, stations } = this.state as BookingsState;
      if (!cardPin) {
        throw new Error("Trying to rent, but missing card pin.");
      }
      if (!currentBooking) {
        throw new Error("Trying to rent, but missing current booking.");
      }

      const station = stations.find(
        stat => stat.stationId === currentBooking.stationId,
      );
      if (!station) {
        throw new Error("Trying to rent, but missing station.");
      }

      const slots = await getSlotInfo(station.stationId);
      if (!slots) {
        throw new Error("Trying to rent, but missing slot detail.");
      }

      const slot = slots.stationSlots.find(
        slot => slot.stationSlotPosition === currentBooking.stationSlotPosition,
      );
      if (!slot) {
        throw new Error("Trying to rent, but missing slot.");
      }

      await rentBike(
        cardPin,
        currentBooking.stationId,
        slot.stationSlotId,
      );
      await this.fetchBookingAndStations();
    } catch (err) {
      console.error(err);

      toast(
        this.context.MAP.POPUP.RENT_DIALOG.ALERT.DEFAULT_ERR,
        { type: 'error' },
      );
    }
  }
}

export default Bookings;

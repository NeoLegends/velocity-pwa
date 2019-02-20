import { Link } from '@reach/router';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { Popup } from 'react-leaflet';

import { Slot, Slots, Station, StationWithAddress } from '../../model';
import { LanguageContext, LanguageType } from '../../resources/language';
import { asHumanReadable } from '../../util/address';

import './station-popup.scss';

interface BaseProps {
  detail: {
    slots: Slots;
    station: StationWithAddress;
  } | null;
  hasBooking: boolean;
  isLoggedIn: boolean;
  station: Station;
}

interface StationPopupProps extends BaseProps {
  onClose: () => void;
  onOpen: (stationId: number) => void;
  onRent: (pin: string, stationId: number, slotId: number) => void;
  onReserve: (stationId: number) => void;
}

interface StationPopupState {
  pin: string;
  rentingStationId: number | null;
}

interface StationPopupBodyProps extends BaseProps, StationPopupState {
  onClose: () => void;
  onOpen: (stationId: number) => void;
  onPinChange: React.ChangeEventHandler<HTMLInputElement>;
  onRentCancel: React.MouseEventHandler;
  onRentComplete: React.MouseEventHandler;
  onRentStart: (stationId: number) => void;
  onReserve: (stationId: number) => void;
}

const PinInputAndRentControls: React.SFC<StationPopupBodyProps> = ({
  pin,

  onPinChange,
  onRentCancel,
  onRentComplete,
}) => {
  const { MAP } = useContext(LanguageContext);

  return (
    <>
      <div className="pin-entry">
        <input
          className="input outline"
          onChange={onPinChange}
          placeholder="PIN"
          type="tel"
        />
      </div>

      <div className="actions">
        <button
          className="btn outline"
          onClick={onRentCancel}
        >
          {MAP.POPUP.RENT_DIALOG.BUTTON.CANCEL}
        </button>

        <button
          className="btn outline"
          disabled={!pin}
          onClick={onRentComplete}
        >
          {MAP.POPUP.BUTTON.RENT}
        </button>
      </div>
    </>
  );
};

const getSlotState = ({ MAP }: LanguageType, slot: Slot) => {
  const states = MAP.POPUP.STATES;
  if (slot.state !== 'OPERATIVE') {
    return states.DEACTIVATED;
  } else if (!slot.isOccupied || !slot.pedelecInfo) {
    return states.NOT_OCCUPIED;
  }

  switch (slot.pedelecInfo.availability) {
    case 'AVAILABLE':
      return states.OCCUPIED;
    case 'INOPERATIVE':
      return states.MAINTENANCE;
    case 'RESERVED':
      return states.RESERVED;
    default:
      return "N/A";
  }
};

// tslint:disable:jsx-no-lambda

const SlotListAndActions: React.SFC<StationPopupBodyProps> = ({
  detail,
  hasBooking,
  isLoggedIn,
  station,

  onRentStart,
  onReserve,
}) => {
  const lang = useContext(LanguageContext);

  const canRentBike =
    isLoggedIn &&
    station.state === 'OPERATIVE' &&
    detail &&
    detail.slots.stationSlots.some(s => s.isOccupied);
  const canBookBike = canRentBike && !hasBooking;

  return (
    <>
      {station.note && <div className="note danger">{station.note}</div>}

      {detail && (
        <ul className="slot-list">
          {detail.slots.stationSlots.map(slot => {
            const isBikePotentiallyRentable = slot.state === 'OPERATIVE' &&
              (!slot.pedelecInfo || slot.pedelecInfo.availability !== 'INOPERATIVE');

            return (
              <li key={slot.stationSlotId} className="slot">
                <span className="slot-no">
                  Slot {slot.stationSlotPosition}
                </span>

                <span className="bike-state">
                  {getSlotState(lang, slot)}
                </span>

                <span className="charge-state">
                  {isBikePotentiallyRentable && slot.pedelecInfo && (
                    `⚡️ ${Math.round(slot.pedelecInfo.stateOfCharge * 100)}%`
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <div className="actions">
        {isLoggedIn ? (
          <>
            <button
              className="btn outline"
              disabled={!canBookBike}
              onClick={() => onReserve(station.stationId)}
            >
              {lang.MAP.POPUP.BUTTON.BOOK}
            </button>

            <button
              className="btn outline"
              disabled={!canRentBike}
              onClick={() => onRentStart(station.stationId)}
            >
              {lang.MAP.POPUP.BUTTON.RENT}
            </button>
          </>
        ) : (
          <Link to="/login">
            {lang.MAP.POPUP.REQUIRE_SIGN_IN.LINK}{lang.MAP.POPUP.REQUIRE_SIGN_IN.TEXT}
          </Link>
        )}
      </div>
    </>
  );
};

const StationPopupBody: React.SFC<StationPopupBodyProps> = props => (
  <Popup
    className="station-popup"
    maxWidth={300}
    onClose={props.onClose}
    onOpen={() => props.onOpen(props.station.stationId)}
  >
    <header>
      <span
        className={classNames(
          'status-indicator',
          props.station.state.toLowerCase(),
        )}
      />

      <div className="meta">
        <h3>{props.station.name}</h3>
        <p>{props.detail && asHumanReadable(props.detail.station.address)}</p>
      </div>
    </header>

    {props.rentingStationId
      ? <PinInputAndRentControls {...props}/>
      : <SlotListAndActions {...props}/>}
  </Popup>
);

// tslint:enable

class StationPopup extends React.Component<StationPopupProps, StationPopupState> {
  state = {
    pin: '',
    rentingStationId: null,
  };

  render() {
    return (
      <StationPopupBody
        {...this.props}
        {...this.state}
        onPinChange={this.handlePinChange}
        onRentCancel={this.handleRentCancel}
        onRentComplete={this.handleRentComplete}
        onRentStart={this.handleRentStart}
      />
    );
  }

  private handlePinChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ pin: ev.target.value })

  private handleRentCancel = () => this.setState({
    pin: '',
    rentingStationId: null,
  })

  private handleRentComplete = () => {
    if (!this.props.onRent || !this.state.rentingStationId || !this.props.detail) {
      return;
    }

    this.props.onRent(
      this.state.pin,
      this.state.rentingStationId!,
      this.props.detail!.slots.recommendedSlot!,
    );
  }

  private handleRentStart = (stationId: number) =>
    this.setState({ rentingStationId: stationId })
}

export default StationPopup;

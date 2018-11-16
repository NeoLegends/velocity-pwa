import { Link } from '@reach/router';
import classNames from 'classnames';
import React from 'react';
import { Popup } from 'react-leaflet';

import { Slot, Slots, Station, StationWithAddress } from '../../model/stations';
import { asHumanReadable } from '../../util/address';

import './station-popup.scss';

interface BaseProps {
  detail: {
    slots: Slots;
    station: StationWithAddress;
  } | null;
  isLoggedIn: boolean;
  station: Station;
}

interface StationPopupProps extends BaseProps {
  onOpenStationPopup: (stationId: number) => void;
  onRent: (pin: string, stationId: number, slotId: number) => void;
  onReserve: (stationId: number) => void;
}

interface StationPopupState {
  pin: string;
  rentingStationId: number | null;
}

interface StationPopupBodyProps extends BaseProps, StationPopupState {
  onOpenStationPopup: (stationId: number) => void;
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
}) => (
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
        Abbrechen
      </button>

      <button
        className="btn outline"
        disabled={!pin}
        onClick={onRentComplete}
      >
        Ausleihen
      </button>
    </div>
  </>
);

const getSlotState = (slot: Slot) => {
  if (slot.state !== 'OPERATIVE') {
    return "Stellplatz deaktiviert";
  } else if (!slot.isOccupied || !slot.pedelecInfo) {
    return "Stellplatz frei";
  }

  switch (slot.pedelecInfo.availability) {
    case 'AVAILABLE':
      return "Fahrrad verfügbar";
    case 'INOPERATIVE':
      return "In Wartung";
    case 'RESERVED':
      return "Reserviert";
    default:
      return "Unbekannt";
  }
};

// tslint:disable:jsx-no-lambda

const SlotListAndActions: React.SFC<StationPopupBodyProps> = ({
  detail,
  isLoggedIn,
  station,

  onRentStart,
  onReserve,
}) => {
  const canRentOrReserveBike =
    isLoggedIn &&
    station.state === 'OPERATIVE' &&
    detail &&
    detail.slots.stationSlots.some(s => s.isOccupied);

  return (
    <>
      {station.note && <div className="note">{station.note}</div>}

      {detail && (
        <ul className="slot-list">
          {detail.slots.stationSlots.map(slot => (
            <li key={slot.stationSlotId} className="slot">
              <span className="slot-no">
                Slot {slot.stationSlotPosition}
              </span>

              <span className="bike-state">
                {getSlotState(slot)}
              </span>

              <span className="charge-state">
                {slot.pedelecInfo &&
                  `⚡️ ${Math.round(slot.pedelecInfo.stateOfCharge * 100)}%`}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="actions">
        {isLoggedIn
          ? (
            <>
              <button
                className="btn outline"
                disabled={!canRentOrReserveBike}
                onClick={() => onReserve(station.stationId)}
              >
                Reservieren
              </button>

              <button
                className="btn outline"
                disabled={!canRentOrReserveBike}
                onClick={() => onRentStart(station.stationId)}
              >
                Ausleihen
              </button>
            </>
          ) : (
            <Link to="/login">
              Anmelden um Fahrrad auszuleihen oder zu reservieren
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
    onOpen={() => props.onOpenStationPopup(props.station.stationId)}
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

class StationPopup extends React.Component<StationPopupProps> {
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

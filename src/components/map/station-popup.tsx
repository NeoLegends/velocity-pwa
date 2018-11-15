import { Link } from '@reach/router';
import classNames from 'classnames';
import React from 'react';
import { Popup } from 'react-leaflet';

import { Slot, Slots, Station, StationWithAddress } from '../../model/stations';
import { asHumanReadable } from '../../util/address';

import './station-popup.scss';

interface StationPopupProps {
  detail: {
    slots: Slots;
    station: StationWithAddress;
  } | null;
  isLoggedIn: boolean;
  station: Station;

  onOpenStationPopup: (stationId: number) => void;
  onRent: (stationId: number) => void;
  onReserve: (stationId: number) => void;
}

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

const StationPopup: React.SFC<StationPopupProps> = ({
  detail,
  isLoggedIn,
  station,

  onOpenStationPopup,
  onRent,
  onReserve,
}) => {
  const canRentOrReserveBike =
    isLoggedIn && detail && detail.slots.stationSlots.some(s => s.isOccupied);

  return (
    <Popup
      className="station-popup"
      maxWidth={300}
      onOpen={() => onOpenStationPopup(station.stationId)}
    >
      <header>
        <span
          className={classNames(
            'status-indicator',
            station.state.toLowerCase(),
          )}
        />

        <div className="meta">
          <h3>{station.name}</h3>
          <p>{detail && asHumanReadable(detail.station.address)}</p>
        </div>
      </header>

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
                onClick={() => onRent(station.stationId)}
              >
                Ausleihen
              </button>
            </>)
          : (
            <Link to="/login">
              Anmelden um Fahrrad auszuleihen oder zu reservieren
            </Link>
          )}
      </div>
    </Popup>
  );
};

// tslint:enable

export default StationPopup;

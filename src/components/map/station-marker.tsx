import classNames from 'classnames';
import { icon } from 'leaflet';
import React from 'react';
import { Marker, Popup } from 'react-leaflet';

import { Slots, Station, StationWithAddress } from '../../model/stations';
import logo from '../../resources/logo.png';
import { asHumanReadable } from '../../util/address';

import './station-marker.scss';

interface StationMarkerProps {
  detail: {
    slots: Slots;
    station: StationWithAddress;
  } | null;
  station: Station;

  onOpenStationPopup: (stationId: number) => void;
  onRent: (stationId: number) => void;
  onReserve: (stationId: number) => void;
}

const stationIcon = icon({
  iconUrl: logo,
  iconSize: [25.3, 29.37],
});

// tslint:disable:jsx-no-lambda

const StationMarker: React.SFC<StationMarkerProps> = ({
  detail,
  station,

  onOpenStationPopup,
  onRent,
  onReserve,
}) => (
  <Marker
    icon={stationIcon}
    position={[station.locationLatitude, station.locationLongitude]}
  >
    <Popup
      className="station-marker"
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
        <ul className="bike-list">
          {detail.slots.stationSlots.map(slot => (
            <li key={slot.stationSlotId} className="bike">
              <span className="attribute">
                Slot {slot.stationSlotPosition}
              </span>

              <span className="bike-state">
                {slot.state === 'OPERATIVE'
                  ? slot.isOccupied
                    ? (slot.pedelecInfo && slot.pedelecInfo.availability) === 'AVAILABLE'
                      ? "Fahrrad verfügbar"
                      : "In Wartung"
                    : "Stellplatz frei"
                  : "Stellplatz deaktiviert"}
              </span>

              <span className="attribute">
                {slot.pedelecInfo &&
                  `⚡️ ${Math.round(slot.pedelecInfo.stateOfCharge * 100)}%`}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="actions">
        <button
          className="btn outline"
          disabled={!detail || !detail.slots.stationSlots.some(s => s.isOccupied)}
          onClick={() => onReserve(station.stationId)}
        >
          Reservieren
        </button>

        <button
          className="btn outline"
          disabled={!detail}
          onClick={() => onRent(station.stationId)}
        >
          Ausleihen
        </button>
      </div>
    </Popup>
  </Marker>
);

// tslint:enable

export default StationMarker;

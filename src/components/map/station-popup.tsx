import { Link } from '@reach/router';
import classNames from 'classnames';
import React, { useCallback, useContext, useState } from 'react';
import { Popup } from 'react-leaflet';

import { useFormField } from '../../hooks/form';
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

interface PinInputAndRentControlsProps {
  pin: string;

  onPinChange: React.ChangeEventHandler<HTMLInputElement>;
  onRentCancel: React.MouseEventHandler;
  onRentComplete: React.MouseEventHandler;
}

interface SlotListAndActionsProps extends BaseProps {
  onRentStart: React.MouseEventHandler;
  onReserve: React.MouseEventHandler;
}

const PinInputAndRentControls: React.SFC<PinInputAndRentControlsProps> = ({
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

const SlotListAndActions: React.SFC<SlotListAndActionsProps> = ({
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
              onClick={onReserve}
            >
              {lang.MAP.POPUP.BUTTON.BOOK}
            </button>

            <button
              className="btn outline"
              disabled={!canRentBike}
              onClick={onRentStart}
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

const StationPopup: React.SFC<StationPopupProps> = props => {
  const [pin, handlePinChange, setPin] = useFormField('');
  const [isRenting, setIsRenting] = useState(false);

  const handleOpen = useCallback(
    () => props.onOpen(props.station.stationId),
    [props.onOpen, props.station.stationId],
  );

  const handleRentCancel = useCallback(() => {
    setIsRenting(false);
    setPin('');
  }, []);

  const handleRentComplete = useCallback(
    () => {
      if (!props.detail) {
        return;
      }

      props.onRent(
        pin,
        props.station.stationId,
        props.detail.slots.recommendedSlot!,
      );
    },
    [pin, props.station.stationId, props.detail],
  );

  const handleRentStart = useCallback(() => setIsRenting(true), []);

  const handleReserve = useCallback(
    () => props.onReserve(props.station.stationId),
    [props.onReserve, props.station.stationId],
  );

  return (
    <Popup
      className="station-popup"
      maxWidth={300}
      onClose={props.onClose}
      onOpen={handleOpen}
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

      {isRenting ? (
        <PinInputAndRentControls
          pin={pin}
          onPinChange={handlePinChange}
          onRentCancel={handleRentCancel}
          onRentComplete={handleRentComplete}
        />
      ) : (
        <SlotListAndActions
          {...props}
          onRentStart={handleRentStart}
          onReserve={handleReserve}
        />
      )}
    </Popup>
  );
};

export default StationPopup;

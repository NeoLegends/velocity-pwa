import { Link } from '@reach/router';
import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Measure, { ContentRect } from 'react-measure';

import { useFormField } from '../../hooks/form';
import { useBooking, useOpenableStation, OpenedStation } from '../../hooks/map';
import { useSavedPin } from '../../hooks/pin';
import { Booking, Slot, Station } from '../../model';
import { LanguageContext } from '../../resources/language';
import Spinner from '../util/spinner';

import './rent-popup.scss';
import Slider from './slider';

interface RentControlsProps {
  booking: Booking | null;
  openedStation: OpenedStation;
  selectedSlot: Slot | null;

  onBookBike: React.MouseEventHandler;
  onRentBike: (pin: string) => void;
}

const RentControls: React.FC<RentControlsProps> = ({
  booking,
  openedStation,
  selectedSlot,

  onBookBike,
  onRentBike,
}) => {
  const [pin, setPin] = useSavedPin();
  const [pinInput, handlePinChange] = useFormField('');

  const handleSubmitPin = useCallback(
    (ev: React.FormEvent) => {
      ev.preventDefault();
      setPin(pinInput);
    },
    [pinInput],
  );

  const { map, MAP } = useContext(LanguageContext);

  const canRentBike =
    openedStation.station.state === 'OPERATIVE' &&
    openedStation.slots.stationSlots.some(s => s.isOccupied);
  const canBookBike = canRentBike && !booking;

  return (
    pin ? (
      <div className="rent-controls">
        <Slider
          className="slider"
          background={({ className }) => (
            <span className={className}>
              {selectedSlot
                ? `${map.RENT.SLIDE_FOR_BIKE_NO1} ${selectedSlot.stationSlotPosition} ${map.RENT.SLIDE_FOR_BIKE_NO2}`
                : map.RENT.SLIDE_FOR_BEST_BIKE}
            </span>
          )}
          disabled={!canRentBike}
          onCompleted={() => onRentBike(pin)}
        />

        <button
          className="btn outline book"
          disabled={!canBookBike}
          onClick={onBookBike}
        >
          {MAP.POPUP.BUTTON.BOOK}
        </button>
      </div>
    ) : (
      <form className="rent-controls" onSubmit={handleSubmitPin}>
        <p>{map.PIN.CTA}</p>

        <input
          className="input outline"
          onChange={handlePinChange}
          placeholder="PIN"
          type="tel"
          value={pinInput}
        />

        <button
          className="btn outline"
          disabled={
            !pinInput
              || isNaN(pinInput as unknown as number)
              || !isFinite(pinInput as unknown as number)
          }
          type="submit"
        >
          {map.PIN.ACTION}
        </button>
      </form>
    )
  );
};

interface RentPopupProps {
  className?: string;
  isLoggedIn: boolean;
  openedStationId: number | null;
  stations: Station[];

  onBookBike: () => void;
  onRentBike: (pin: string, slotId: number) => void;
}

const RentPopup: React.FC<RentPopupProps> = ({
  className,
  isLoggedIn,
  openedStationId,
  stations,

  onBookBike,
  onRentBike,
}) => {
  const [booking, fetchBooking] = useBooking();
  const [stationDetail, loadStationDetail, dismissStationDetail] =
    useOpenableStation();
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [useCenteredStyling, setUseCenteredStyling] = useState(false);

  useEffect(
    () => {
      if (openedStationId === null) {
        return;
      }

      loadStationDetail(openedStationId);
      fetchBooking();

      return () => {
        dismissStationDetail();
        setSelectedSlot(null);
      };
    },
    [openedStationId],
  );

  const selectedStation = useMemo(
    () => stations.find(stat => stat.stationId === openedStationId),
    [openedStationId],
  );
  const availableSlots = useMemo(
    () => {
      if (!stationDetail) {
        return [];
      }

      return stationDetail.slots.stationSlots.filter(
        slot =>
          slot.isOccupied &&
          (!slot.pedelecInfo || slot.pedelecInfo.availability !== 'INOPERATIVE'),
      );
    },
    [stationDetail],
  );
  const handleClickOnPopup = useCallback(
    (ev: React.MouseEvent) => ev.stopPropagation(),
    [],
  );
  const handlePopupResize = useCallback(
    (ev: ContentRect) => {
      // 32 is 2 * padding
      const popupWidth = ev.client!.width - 32;

      // A slot item is 64px wide and there is a 16px margin between each
      const requiredWidth =
        64 * availableSlots.length + 16 * (availableSlots.length - 1);

      setUseCenteredStyling(requiredWidth < popupWidth);
    },
    [availableSlots],
  );

  const { map, MAP } = useContext(LanguageContext);

  const handleRent = (pin: string) => {
    const slotId = selectedSlot
      ? selectedSlot.stationSlotId
      : stationDetail!.slots.recommendedSlot!;
    onRentBike(pin, slotId);
  };

  return (
    <Measure client onResize={handlePopupResize}>
      {({ measureRef }) => (
        <div
          className={classNames(
            'rent-popup',
            openedStationId && 'open',
            className,
          )}
          onClick={handleClickOnPopup}
          ref={measureRef}
        >
          <h2 className="station-name">
            {selectedStation && selectedStation.name}
          </h2>

          <hr />

          {stationDetail ? (
            availableSlots.length ? (
              <>
                <ul
                  className={classNames(
                    'slot-list',
                    useCenteredStyling && 'centered',
                  )}
                  ref={measureRef}
                >
                  {availableSlots.map(slot => {
                    const isReserved =
                      slot.pedelecInfo &&
                      slot.pedelecInfo.availability === 'RESERVED';
                    const isReservedByMe =
                      booking &&
                      booking.stationId === stationDetail.station.stationId &&
                      booking.stationSlotPosition === slot.stationSlotPosition;

                    const handleClick = () =>
                      (!isReserved || isReservedByMe) && setSelectedSlot(slot);

                    return (
                      <li
                        className="slot-entry column"
                        key={slot.stationSlotId}
                        onClick={handleClick}
                      >
                        <div
                          className={classNames(
                            "slot-icon outline column",
                            isReserved && "reserved",
                            isReservedByMe && "me",
                            selectedSlot
                              && selectedSlot.stationSlotId === slot.stationSlotId
                              && 'selected',
                          )}
                        >
                          <p>⚡️</p>
                          {slot.stateOfCharge !== null && (
                            <p>
                              {Math.round((slot.stateOfCharge || 0) * 100)}%
                            </p>
                          )}
                        </div>

                        <span>Slot {slot.stationSlotPosition}</span>
                      </li>
                    );
                  })}
                </ul>

                {isLoggedIn ? (
                  <RentControls
                    booking={booking}
                    openedStation={stationDetail}
                    selectedSlot={selectedSlot}
                    onBookBike={onBookBike}
                    onRentBike={handleRent}
                  />
                ) : (
                  <Link className="login-cta" to="/login">
                    {MAP.POPUP.REQUIRE_SIGN_IN.LINK}
                    {MAP.POPUP.REQUIRE_SIGN_IN.TEXT}
                  </Link>
                )}
              </>
            ) : (
              <p className="no-bikes">
                {map.NO_BIKES}
              </p>
            )
          ) : (
            <Spinner className="loading-station" />
          )}
        </div>
      )}
    </Measure>
  );
};

export default RentPopup;

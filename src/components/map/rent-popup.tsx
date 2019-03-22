import { Link } from '@reach/router';
import classNames from 'classnames';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import { useSelectedSlot, useStationDetail } from '../../hooks/rent-popup';
import { useBooking } from '../../hooks/stations';
import { InvalidStatusCodeError, Station } from '../../model';
import { bookBike, rentBike } from '../../model/stations';
import { LanguageContext } from '../../resources/language';
import Overlay from '../util/overlay';
import Spinner from '../util/spinner';

import RentControls from './rent-controls';
import './rent-popup.scss';
import SlotList from './slot-list';

interface RentPopupProps {
  className?: string;
  isLoggedIn: boolean;
  openedStationId: number | null;
  stations: Station[];

  onRequestClose: () => void;
}

const RentPopup: React.FC<RentPopupProps> = ({
  className,
  isLoggedIn,
  openedStationId,
  stations,

  onRequestClose,
}) => {
  const { booking, cancelBooking, fetchBooking, refreshBooking } = useBooking();
  const {
    availableSlots,
    stationDetail,
    fetchStationDetail,
  } = useStationDetail(openedStationId);
  const { selectedSlot, setSelectedSlot } = useSelectedSlot(
    openedStationId,
    booking,
    stationDetail,
  );

  useEffect(() => {
    if (openedStationId) {
      fetchBooking();
    }
  }, [openedStationId]);

  const selectedStation = useMemo(
    () => stations.find(stat => stat.stationId === openedStationId),
    [openedStationId],
  );
  const handleClickOnPopup = useCallback(
    (ev: React.MouseEvent) => ev.stopPropagation(),
    [],
  );

  const { map, BUCHUNGEN, MAP } = useContext(LanguageContext);

  const handleBook = useCallback(() => {
    if (!selectedStation) {
      throw new Error('Trying to reserve a bike, but no station selected.');
    }

    bookBike(selectedStation.stationId)
      .then(() => Promise.all([fetchBooking(), fetchStationDetail()]))
      .catch(err => {
        console.error('Error while reserving bike:', err);
        toast(MAP.POPUP.RENT_DIALOG.ALERT.DEFAULT_ERR, { type: 'error' });
      });
  }, [fetchBooking, fetchStationDetail, selectedStation, MAP]);

  const handleCancelBooking = useCallback(() => {
    if (!booking) {
      return;
    }

    return cancelBooking()
      .then(() => Promise.all([fetchBooking(), fetchStationDetail()]))
      .catch(err => {
        console.error('Error while canceling a booking:', err);
        toast(BUCHUNGEN.ALERT.LOAD_CURR_BOOKING_ERR, { type: 'error' });
      });
  }, [booking, fetchBooking, fetchStationDetail, selectedStation, BUCHUNGEN]);

  const handleRefreshBooking = useCallback(() =>
    refreshBooking()
      .then(() => Promise.all([fetchBooking(), fetchStationDetail()]))
      .catch(err => {
        console.error('Error while refreshing a booking:', err);
        toast(BUCHUNGEN.ALERT.LOAD_CURR_BOOKING_ERR, { type: 'error' });
      }),
    [fetchBooking, fetchStationDetail, refreshBooking, BUCHUNGEN]);

  const handleRent = useCallback(
    (pin: string) => {
      if (!selectedStation || !stationDetail) {
        throw new Error('Trying to rent a bike, but no station selected.');
      }

      const slotId = selectedSlot
        ? selectedSlot.stationSlotId
        : stationDetail.slots.recommendedSlot!;
      const stationId = selectedStation.stationId;

      onRequestClose();

      rentBike(pin, stationId, slotId)
        .then(() =>
          toast(MAP.POPUP.RENT_DIALOG.ALERT.DEFAULT_SUCCESS, {
            type: 'success',
          }),
        )
        .catch(err => {
          console.error('Error while renting out bike:', err);
          const code = (err as InvalidStatusCodeError).statusCode;
          const message =
            code === 403
              ? MAP.POPUP.RENT_DIALOG.ALERT.INVALID_PIN
              : code === 406
              ? MAP.POPUP.RENT_DIALOG.ALERT.SLOT_LOCKED
              : MAP.POPUP.RENT_DIALOG.ALERT.DEFAULT_ERR;

          toast(message, { type: 'error' });
        });
    },
    [onRequestClose, selectedSlot, selectedStation, stationDetail, MAP],
  );

  return (
    <Overlay isOpen={Boolean(openedStationId)} onRequestClose={onRequestClose}>
      {({ focusRef }) => (
        <div
          aria-labelledby="station-name"
          className={classNames(
            'rent-popup',
            openedStationId && 'open',
            className,
          )}
          onClick={handleClickOnPopup}
          role="dialog"
        >
          <h2 id="station-name" className="station-name">
            {selectedStation && selectedStation.name}
          </h2>

          <hr />

          {!stationDetail ? (
            <Spinner className="loading-station" />
          ) : !availableSlots.length ? (
            <p className="no-bikes">{map.NO_BIKES}</p>
          ) : (
            <>
              <SlotList
                availableSlots={availableSlots}
                booking={booking}
                focusRef={focusRef}
                onSetSelectedSlot={setSelectedSlot}
                selectedSlot={selectedSlot}
                stationId={stationDetail.station.stationId}
              />

              {isLoggedIn ? (
                <RentControls
                  booking={booking}
                  openedStation={stationDetail}
                  selectedSlot={selectedSlot}
                  stations={stations}
                  onBookBike={handleBook}
                  onCancelBooking={handleCancelBooking}
                  onRefreshBooking={handleRefreshBooking}
                  onRentBike={handleRent}
                />
              ) : (
                <Link className="login-cta" to="/login">
                  {MAP.POPUP.REQUIRE_SIGN_IN.LINK}
                  {MAP.POPUP.REQUIRE_SIGN_IN.TEXT}
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </Overlay>
  );
};

export default RentPopup;

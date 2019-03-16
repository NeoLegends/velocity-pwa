import { Link } from '@reach/router';
import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useOpenableStation } from '../../hooks/map';
import { useBooking } from '../../hooks/stations';
import { Slot, Station } from '../../model';
import { LanguageContext } from '../../resources/language';
import Spinner from '../util/spinner';

import RentControls from './rent-controls';
import './rent-popup.scss';
import SlotList from './slot-list';

interface RentPopupProps {
  className?: string;
  isLoggedIn: boolean;
  openedStationId: number | null;
  stations: Station[];

  onBookBike: () => void;
  onCancelBooking: () => void;
  onRentBike: (pin: string, slotId: number) => void;
}

const RentPopup: React.FC<RentPopupProps> = ({
  className,
  isLoggedIn,
  openedStationId,
  stations,

  onBookBike,
  onCancelBooking,
  onRentBike,
}) => {
  const { booking, fetchBooking } = useBooking();
  const [
    stationDetail,
    loadStationDetail,
    dismissStationDetail,
  ] = useOpenableStation();
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    if (openedStationId === null) {
      return;
    }

    loadStationDetail(openedStationId);
    fetchBooking();

    return () => {
      dismissStationDetail();
      setSelectedSlot(null);
    };
  }, [openedStationId]);

  useEffect(() => {
    if (
      !booking ||
      !openedStationId ||
      !stationDetail ||
      openedStationId !== booking.stationId
    ) {
      return;
    }
    const bookedSlot = stationDetail.slots.stationSlots.find(
      slot => slot.stationSlotPosition === booking.stationSlotPosition,
    );
    bookedSlot && setSelectedSlot(bookedSlot);
  }, [booking, openedStationId, stationDetail, setSelectedSlot]);

  const availableSlots = useMemo(() => {
    if (!stationDetail) {
      return [];
    }

    return stationDetail.slots.stationSlots.filter(
      slot =>
        slot.isOccupied &&
        (!slot.pedelecInfo || slot.pedelecInfo.availability !== 'INOPERATIVE'),
    );
  }, [stationDetail]);
  const selectedStation = useMemo(
    () => stations.find(stat => stat.stationId === openedStationId),
    [openedStationId],
  );
  const handleClickOnPopup = useCallback(
    (ev: React.MouseEvent) => ev.stopPropagation(),
    [],
  );

  const { map, MAP } = useContext(LanguageContext);

  const handleRent = (pin: string) => {
    const slotId = selectedSlot
      ? selectedSlot.stationSlotId
      : stationDetail!.slots.recommendedSlot!;
    onRentBike(pin, slotId);
  };

  return (
    <div
      className={classNames('rent-popup', openedStationId && 'open', className)}
      onClick={handleClickOnPopup}
    >
      <h2 className="station-name">
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
              onBookBike={onBookBike}
              onCancelBooking={onCancelBooking}
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
  );
};

export default RentPopup;

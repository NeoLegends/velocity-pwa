import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { Booking, Slot, Slots, StationWithAddress } from '../model';
import { getSingleStation, getSlotInfo } from '../model/stations';
import { LanguageContext } from '../resources/language';

import { useInterval } from './interval';

export interface StationDetail {
  slots: Slots;
  station: StationWithAddress;
}

export const useSelectedSlot = (
  openedStationId: number | null,
  booking: Booking | null,
  stationDetail: StationDetail | null,
) => {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    // Deselect when station is closed
    if (!openedStationId || !stationDetail) {
      setSelectedSlot(null);
      return;
    }

    // Autoselect the booked slot if we have a booking, otherwise select
    // the fullest bike.
    const slotToSelect =
      booking && openedStationId === booking.stationId
        ? stationDetail.slots.stationSlots.find(
            slot => slot.stationSlotPosition === booking.stationSlotPosition,
          )
        : stationDetail.slots.stationSlots.find(
            slot => slot.stationSlotId === stationDetail.slots.recommendedSlot,
          );

    if (slotToSelect) {
      setSelectedSlot(slotToSelect);
      return () => setSelectedSlot(null);
    }
  }, [booking, openedStationId, stationDetail]);

  return { selectedSlot, setSelectedSlot };
};

export const useStationDetail = (stationId: number | null) => {
  const { MAP } = useContext(LanguageContext);
  const [stationDetail, setStationDetail] = useState<StationDetail | null>(
    null,
  );

  const availableSlots = useMemo(() => {
    if (!stationDetail) {
      return [];
    }

    return stationDetail.slots.stationSlots.filter(
      slot =>
        slot.isOccupied &&
        slot.state === 'OPERATIVE' &&
        (!slot.pedelecInfo || slot.pedelecInfo.availability !== 'INOPERATIVE'),
    );
  }, [stationDetail]);

  const dismissStationDetail = useCallback(() => setStationDetail(null), []);
  const fetchStationDetail = useCallback(() => {
    if (stationId === null) {
      setStationDetail(null);
      return;
    }

    return Promise.all([getSingleStation(stationId), getSlotInfo(stationId)])
      .then(([detailedStation, slotInfo]) => {
        if (!detailedStation || !slotInfo) {
          throw new Error(`Failed fetching station ${stationId}.`);
        }

        setStationDetail({ slots: slotInfo, station: detailedStation });
      })
      .catch(err => {
        console.error('Error while opening station popup:', err);
        toast(MAP.ALERT.STATION_DETAILS, { type: 'error' });
      });
  }, [stationId, MAP]);

  useInterval(fetchStationDetail);

  return {
    availableSlots,
    dismissStationDetail,
    fetchStationDetail,
    stationDetail,
  };
};

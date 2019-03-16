import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { Booking, Slot, Slots, StationWithAddress } from '../model';
import { getSingleStation, getSlotInfo } from '../model/stations';
import { LanguageContext } from '../resources/language';

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

  // Autoselect the booked slot
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
    if (bookedSlot) {
      setSelectedSlot(bookedSlot);
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

  useEffect(() => {
    fetchStationDetail();
    return () => setStationDetail(null);
  }, [stationId]);

  return {
    availableSlots,
    dismissStationDetail,
    fetchStationDetail,
    stationDetail,
  };
};

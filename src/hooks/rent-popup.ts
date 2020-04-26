import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Booking, Slot, Slots, StationWithAddress } from '../model';
import { getSingleStation, getSlotInfo } from '../model/stations';
import { LanguageContext } from '../resources/language';
import { toast } from '../util/toast';

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
    if (!openedStationId || !stationDetail) {
      return;
    }

    // Autoselect the recommended slot, if it is at the given station, otherwise
    // select the fullest bike.
    const slotToSelect =
      stationDetail.slots.stationSlots.find(
        (slot) => slot.stationSlotId === stationDetail.slots.recommendedSlot,
      ) ||
      stationDetail.slots.stationSlots
        .filter(
          (slot) =>
            slot.pedelecInfo && slot.pedelecInfo.availability === 'AVAILABLE',
        )
        .reduce(
          (acc: Slot | null, item) =>
            !acc ||
            item.pedelecInfo!.stateOfCharge > acc.pedelecInfo!.stateOfCharge
              ? item
              : acc,
          null,
        );

    if (slotToSelect) {
      setSelectedSlot(slotToSelect);

      // Deselect when station is closed
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
      (slot) =>
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
      .catch((err) => {
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

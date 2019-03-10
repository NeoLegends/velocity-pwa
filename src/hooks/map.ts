import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Booking, Slots, StationWithAddress } from '../model';
import { getSingleStation, getSlotInfo } from '../model/stations';
import { getCurrentBooking } from '../model/transaction';
import { LanguageContext } from '../resources/language';
import { isIos } from '../util/is-ios';

export interface OpenedStation {
  slots: Slots;
  station: StationWithAddress;
}

export interface Viewport {
  center: [number, number];
  zoom: number;
}

const STORAGE_VIEWPORT_KEY = 'velocity/viewport';

const viewportStorage = isIos ? localStorage : sessionStorage;

const defaultViewport: Viewport = {
  center: [50.77403035497566, 6.084194183349609],
  zoom: 14,
};

export const useBooking = () => {
  const { BUCHUNGEN } = useContext(LanguageContext);
  const [booking, setBooking] = useState<Booking | null>(null);

  const fetchBooking = useCallback(
    () => getCurrentBooking()
      .then(setBooking)
      .catch(err => {
        console.error("Failed loading current booking:", err);
        toast(BUCHUNGEN.ALERT.LOAD_CURR_BOOKING_ERR, { type: 'error' });
      }),
    [BUCHUNGEN],
  );

  useEffect(() => { fetchBooking(); }, []);

  return [booking, fetchBooking] as [Booking | null, () => Promise<void>];
};

export const useOpenableStation = () => {
  const { MAP } = useContext(LanguageContext);
  const [station, setStation] = useState<OpenedStation | null>(null);

  const handleOpenStation = useCallback(
    (stationId: number | null) => {
      if (stationId === null) {
        setStation(null);
        return;
      }

      Promise.all([
        getSingleStation(stationId),
        getSlotInfo(stationId),
      ])
        .then(([detailedStation, slotInfo]) => {
          if (!detailedStation || !slotInfo) {
            throw new Error(`Failed fetching station ${stationId}.`);
          }

          setStation({ slots: slotInfo, station: detailedStation });
        })
        .catch(err => {
          console.error("Error while opening station popup:", err);
          toast(MAP.ALERT.STATION_DETAILS, { type: 'error' });
        });
    },
    [MAP],
  );

  const handleCloseStation = useCallback(() => setStation(null), []);

  return [station, handleOpenStation, handleCloseStation] as
    [OpenedStation | null, (stationId: number) => void, () => void];
};

const setLsViewport = (v: Viewport) => viewportStorage.setItem(
  STORAGE_VIEWPORT_KEY,
  JSON.stringify(v),
);

export const useCachedViewport = () => {
  const [viewport, setViewport] = useState<Viewport>(defaultViewport);

  useEffect(() => {
    const viewport = viewportStorage.getItem(STORAGE_VIEWPORT_KEY);
    if (!viewport) {
      return;
    }

    try {
      const parsedViewport = JSON.parse(viewport);
      if (parsedViewport) {
        setViewport(parsedViewport);
      }
    } catch (err) {
      console.warn(
        "Failed to deserialize local storage viewport, removing incorrect entry.\n\n",
        err,
      );
      viewportStorage.removeItem(STORAGE_VIEWPORT_KEY);
    }
  }, []);

  return [viewport, setLsViewport] as [Viewport, (v: Viewport) => void];
};

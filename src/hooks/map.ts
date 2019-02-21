import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Slots, StationWithAddress } from '../model';
import { getSingleStation, getSlotInfo } from '../model/stations';
import { hasCurrentBooking } from '../model/transaction';
import { LanguageContext } from '../resources/language';

export interface OpenedStation {
  slots: Slots;
  station: StationWithAddress;
  userHasBooking: boolean;
}

export interface Viewport {
  center: [number, number];
  zoom: number;
}

const STORAGE_VIEWPORT_KEY = 'velocity/viewport';

const viewportStorage =
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    ? localStorage
    : sessionStorage;

const defaultViewport: Viewport = {
  center: [50.77403035497566, 6.084194183349609],
  zoom: 14,
};

export const useOpenableStation = () => {
  const { MAP } = useContext(LanguageContext);
  const [station, setStation] = useState<OpenedStation | null>(null);

  const handleOpenStation = (stationId: number | null) => {
    if (stationId === null) {
      setStation(null);
      return;
    }

    Promise.all([
      hasCurrentBooking(),
      getSingleStation(stationId),
      getSlotInfo(stationId),
    ])
      .then(([hasBooking, detailedStation, slotInfo]) => {
        if (!detailedStation || !slotInfo) {
          throw new Error(`Failed fetching station ${stationId}.`);
        }

        setStation({
          slots: slotInfo,
          station: detailedStation,
          userHasBooking: hasBooking,
        });
      })
      .catch(err => {
        console.error("Error while opening station popup:", err);
        toast(MAP.ALERT.STATION_DETAILS, { type: 'error' });
      });
  };

  const handleCloseStation = () => setStation(null);

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

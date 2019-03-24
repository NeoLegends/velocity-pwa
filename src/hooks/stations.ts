import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Booking, Station } from '../model';
import {
  bookBike as doBook,
  cancelCurrentBooking,
  getAllStations,
  getCurrentBooking,
} from '../model/stations';
import { LanguageContext } from '../resources/language';

import { useInterval } from './interval';

const LOCALSTORAGE_STATIONS_KEY = 'velocity/stations';

export const useBooking = () => {
  const { BUCHUNGEN, PARTICULARS } = useContext(LanguageContext);
  const [booking, setBooking] = useState<Booking | null>(null);

  const bookBike = useCallback(
    (stationId: number) =>
      doBook(stationId)
        .then(setBooking)
        .catch(err => {
          console.error('Error while booking bike:', err);
          toast(BUCHUNGEN.ALERT.LOAD_CURR_BOOKING_ERR, { type: 'error' });
        }),
    [BUCHUNGEN],
  );
  const cancelBooking = useCallback(
    () =>
      cancelCurrentBooking()
        .then(() => setBooking(null))
        .catch(err => {
          console.error('Failed to cancel current booking:', err);
          toast(PARTICULARS.MODAL.PIN.ALERT.ERROR.GENERAL, { type: 'error' });
        }),
    [PARTICULARS],
  );
  const fetchBooking = useCallback(
    () =>
      getCurrentBooking()
        .then(setBooking)
        .catch(err => {
          console.error('Failed loading current booking:', err);
          toast(BUCHUNGEN.ALERT.LOAD_CURR_BOOKING_ERR, { type: 'error' });
        }),
    [BUCHUNGEN],
  );
  const refreshBooking = useCallback(
    async () => {
      try {
        let oldBooking = await getCurrentBooking();
        if (!oldBooking) {
          oldBooking = booking;
        }
        await cancelCurrentBooking();
        if (oldBooking) {
          const currBooking = await doBook(oldBooking.stationId);
          await setBooking(currBooking);
        } else {
          await fetchBooking();
        }
      } catch (err) {
        console.error('Failed refreshing current booking:', err);
        toast(BUCHUNGEN.ALERT.LOAD_CURR_BOOKING_ERR, { type: 'error' });
      }
    },
    [BUCHUNGEN],
  );

  useInterval(fetchBooking);

  return { booking, bookBike, cancelBooking, fetchBooking, refreshBooking };
};

export const useStations = () => {
  const { MAP } = useContext(LanguageContext);
  const [stations, setStations] = useState<Station[]>([]);

  const fetchStations = useCallback(() => {
    getAllStations()
      .then(stations => {
        localStorage.setItem(
          LOCALSTORAGE_STATIONS_KEY,
          JSON.stringify(stations),
        );
        setStations(stations);
      })
      .catch(err => {
        console.error('Error while loading stations:', err);
        toast(MAP.ALERT.STATION_LOAD, { type: 'error' });
      });
  }, [MAP]);

  useEffect(() => {
    const lsStations = localStorage.getItem(LOCALSTORAGE_STATIONS_KEY);
    if (lsStations) {
      setStations(JSON.parse(lsStations));
    }
  }, []);

  useInterval(fetchStations);

  return { stations, fetchStations };
};

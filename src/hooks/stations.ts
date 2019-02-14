import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Station } from '../model';
import { getAllStations } from '../model/stations';
import { LanguageContext } from '../resources/language';

const LOCALSTORAGE_STATIONS_KEY = 'velocity/stations';

export const useStations = () => {
  const { MAP } = useContext(LanguageContext);
  const [stations, setStations] = useState<Station[]>([]);

  const fetchStations = () => {
    getAllStations()
      .then(stations => {
        localStorage.setItem(LOCALSTORAGE_STATIONS_KEY, JSON.stringify(stations));
        setStations(stations);
      })
      .catch(err => {
        console.error("Error while loading stations:", err);
        toast(MAP.ALERT.STATION_LOAD, { type: 'error' });
      });
  };

  useEffect(() => {
    const lsStations = localStorage.getItem(LOCALSTORAGE_STATIONS_KEY);
    if (lsStations) {
      setStations(JSON.parse(lsStations));
    }

    fetchStations();
  }, []);

  return [stations, fetchStations] as [Station[], () => void];
};

import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Station } from '../model';
import { getAllStations } from '../model/stations';
import { LanguageContext } from '../resources/language';

export const useStations = () => {
  const { MAP } = useContext(LanguageContext);
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    getAllStations()
      .then(stations => setStations(stations.sort(
        (a, b) => a.name.localeCompare(b.name),
      )))
      .catch(err => {
        console.error("Error while fetching stations:", err);

        toast(MAP.ALERT.STATION_LOAD, { type: 'error' });
      });
  }, []);

  return stations;
};

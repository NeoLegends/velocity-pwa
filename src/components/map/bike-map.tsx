import { navigate } from '@reach/router';
import { icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { toast } from 'react-toastify';

import { useCachedViewport } from '../../hooks/map';
import { useStations } from '../../hooks/stations';
import { rentBike, reserveBike } from '../../model/stations';
import { LanguageContext } from '../../resources/language';
import logo from '../../resources/logo.png';
import Overlay from '../../util/overlay';

import './bike-map.scss';
import RentPopup from './rent-popup';

interface BikeMapProps {
  className?: string;
  isLoggedIn: boolean;
}

const stationIcon = icon({
  iconUrl: logo,
  iconSize: [25.3, 29.37],
});

const BikeMap: React.FC<BikeMapProps> = ({ className, isLoggedIn }) => {
  const { MAP } = useContext(LanguageContext);

  const [viewport, handleViewportChange] = useCachedViewport();
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [stations] = useStations();

  const handleHashChange = useCallback(() => {
    const stationId = window.location.hash.substr(1);

    if (
      !stationId
        || isNaN(stationId as unknown as number)
        || !isFinite(stationId as unknown as number)
    ) {
      setSelectedStation(null);
      return;
    }

    setSelectedStation(Number(stationId));
  }, []);

  const closePopup = useCallback(() => {
    history.pushState(null, '', '#');
    handleHashChange();
  }, []);
  const handleBook = useCallback(
    () => {
      if (!selectedStation) {
        throw new Error("Trying to reserve a bike, but no station selected.");
      }

      reserveBike(selectedStation)
        .then(() => navigate('/bookings'))
        .catch(err => {
          console.error("Error while reserving bike:", err);
          toast(MAP.POPUP.RENT_DIALOG.ALERT.DEFAULT_ERR, { type: 'error' });
        });
    },
    [selectedStation, MAP],
  );
  const handleRent = useCallback(
    (pin: string, slotId: number) => {
      if (!selectedStation) {
        throw new Error("Trying to rent a bike, but no station selected.");
      }

      rentBike(pin, selectedStation, slotId)
        .then(() => {
          closePopup();
          toast(
            MAP.POPUP.RENT_DIALOG.ALERT.DEFAULT_SUCCESS,
            { type: 'success' },
          );
        })
        .catch(err => {
          console.error("Error while renting out bike:", err);
          toast(MAP.POPUP.RENT_DIALOG.ALERT.DEFAULT_ERR, { type: 'error' });
        });
    },
    [selectedStation, MAP],
  );

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      <Map
        className={className}
        center={viewport.center}
        zoom={viewport.zoom}
        maxZoom={17}
        onViewportChanged={handleViewportChange}
      >
        <TileLayer
          attribution={'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}
          detectRetina={true}
          maxZoom={18}
          url="https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
        />

        {stations.map(station => (
          <Marker
            alt={`Station ${station.name}`}
            icon={stationIcon}
            key={station.stationId}
            position={[station.locationLatitude, station.locationLongitude]}
            onClick={() => {
              history.pushState(null, '', `#${station.stationId}`);
              handleHashChange();
            }}
          />
        ))}
      </Map>

      <Overlay isOpen={Boolean(selectedStation)} onRequestClose={closePopup}>
        <RentPopup
          isLoggedIn={isLoggedIn}
          openedStationId={selectedStation}
          stations={stations}
          onBookBike={handleBook}
          onRentBike={handleRent}
        />
      </Overlay>
    </>
  );
};

export default BikeMap;

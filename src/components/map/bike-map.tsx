import { icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useCallback, useEffect, useState } from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';

import { useCachedViewport } from '../../hooks/map';
import { useStations } from '../../hooks/stations';
import { TILE_URL } from '../../model/urls';
import logoGreyscale from '../../resources/logo-greyscale.png';
import logo from '../../resources/logo.png';

import './bike-map.scss';
import RentPopup from './rent-popup';

interface BikeMapProps {
  className?: string;
  isLoggedIn: boolean;
}

const ATTRIBUTION =
  '&copy; <a href="http://osm.org/copyright" rel="noreferrer noopener">OpenStreetMap</a> contributors';

const stationIcon = icon({
  iconUrl: logo,
  iconSize: [30, 30],
});
const noBikesStationIcon = icon({
  iconUrl: logoGreyscale,
  iconSize: [30, 30],
});

const BikeMap: React.FC<BikeMapProps> = ({ className, isLoggedIn }) => {
  const [viewport, handleViewportChange] = useCachedViewport();
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const { stations } = useStations();

  const handleHashChange = useCallback(() => {
    const stationId = window.location.hash.substr(1);

    if (
      !stationId ||
      isNaN((stationId as unknown) as number) ||
      !isFinite((stationId as unknown) as number)
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

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      <Map
        className={className}
        center={viewport.center || undefined}
        zoom={viewport.zoom || 14}
        maxZoom={17}
        onViewportChanged={handleViewportChange}
      >
        <TileLayer
          attribution={ATTRIBUTION}
          detectRetina={true}
          maxZoom={18}
          url={TILE_URL}
        />

        {stations.map(station => (
          <Marker
            alt={`Station ${station.name}`}
            icon={
              station.numAllSlots > station.numFreeSlots
                ? stationIcon
                : noBikesStationIcon
            }
            key={station.stationId}
            position={[station.locationLatitude, station.locationLongitude]}
            onClick={() => {
              history.pushState(null, '', `#${station.stationId}`);
              handleHashChange();
            }}
          />
        ))}
      </Map>

      <RentPopup
        isLoggedIn={isLoggedIn}
        openedStationId={selectedStation}
        stations={stations}
        onRequestClose={closePopup}
      />
    </>
  );
};

export default BikeMap;

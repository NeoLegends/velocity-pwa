import { icon, IconOptions } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useCallback, useEffect, useState } from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';

import { useCachedViewport } from '../../hooks/map';
import { useStations } from '../../hooks/stations';
import { TILE_URL } from '../../model/urls';
import logoGreyscale from '../../resources/logo-greyscale.png';
import logo from '../../resources/logo.png';
import MakeLazy from '../util/make-lazy';

import './bike-map.scss';

const RentPopup = MakeLazy(() => import('./rent-popup'));

interface BikeMapProps {
  className?: string;
  isLoggedIn: boolean;
}

const ATTRIBUTION =
  '&copy; <a href="http://osm.org/copyright" rel="noreferrer noopener">OpenStreetMap</a> contributors';

const baseIcon: Partial<IconOptions> = {
  iconSize: [30, 30],
  iconAnchor: [15, 30],
};
const stationIcon = icon({
  ...baseIcon,
  iconUrl: logo,
});
const noBikesStationIcon = icon({
  ...baseIcon,
  iconUrl: logoGreyscale,
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
    window.history.pushState(null, '', '#');
    handleHashChange();
  }, [handleHashChange]);

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [handleHashChange]);

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
              station.numAllSlots > station.numFreeSlots &&
              station.state === 'OPERATIVE'
                ? stationIcon
                : noBikesStationIcon
            }
            key={station.stationId}
            position={[station.locationLatitude, station.locationLongitude]}
            onClick={() => {
              window.history.pushState(null, '', `#${station.stationId}`);
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

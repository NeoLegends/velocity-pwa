import { navigate } from '@reach/router';
import { icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useContext } from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { toast } from 'react-toastify';

import { useCachedViewport, useOpenableStation } from '../../hooks/map';
import { useStations } from '../../hooks/stations';
import { rentBike, reserveBike } from '../../model/stations';
import { LanguageContext } from '../../resources/language';
import logo from '../../resources/logo.png';

import './bike-map.scss';
import StationPopup from './station-popup';

interface BikeMapProps {
  className?: string;
  isLoggedIn: boolean;
}

const stationIcon = icon({
  iconUrl: logo,
  iconSize: [25.3, 29.37],
});

const BikeMap: React.SFC<BikeMapProps> = ({ className, isLoggedIn }) => {
  const { MAP } = useContext(LanguageContext);

  const [viewport, handleViewportChange] = useCachedViewport();
  const [
    openedStation,
    handleOpenStation,
    handleCloseStation,
  ] = useOpenableStation();
  const [stations] = useStations();

  const handleRent = (pin: string, stationId: number, slotId: number) => {
    rentBike(pin, stationId, slotId)
      .then(() => toast(
        MAP.POPUP.RENT_DIALOG.ALERT.DEFAULT_SUCCESS,
        { type: 'success' },
      ))
      .catch(err => {
        console.error("Error while renting out bike:", err);
        toast(MAP.POPUP.RENT_DIALOG.ALERT.DEFAULT_ERR, { type: 'error' });
      });
  };

  const handleReserve = (stationId: number) => {
    reserveBike(stationId)
      .then(() => navigate('/bookings'))
      .catch(err => {
        console.error("Error while reserving bike:", err);
        toast(MAP.POPUP.RENT_DIALOG.ALERT.DEFAULT_ERR, { type: 'error' });
      });
  };

  return (
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
          icon={stationIcon}
          key={station.stationId}
          position={[station.locationLatitude, station.locationLongitude]}
        >
          <StationPopup
            detail={
              openedStation && openedStation.station.stationId === station.stationId
                ? openedStation
                : null
            }
            hasBooking={openedStation && openedStation.userHasBooking || false}
            isLoggedIn={isLoggedIn}
            station={station}
            onClose={handleCloseStation}
            onOpen={handleOpenStation}
            onRent={handleRent}
            onReserve={handleReserve}
          />
        </Marker>
      ))}
    </Map>
  );
};

export default BikeMap;

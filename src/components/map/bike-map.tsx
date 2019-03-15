import { icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { toast } from 'react-toastify';

import { useCachedViewport, useOpenableStation } from '../../hooks/map';
import { useStations, useBooking } from '../../hooks/stations';
import { InvalidStatusCodeError } from '../../model';
import { bookBike, rentBike } from '../../model/stations';
import { TILE_URL } from '../../model/urls';
import { LanguageContext } from '../../resources/language';
import logo from '../../resources/logo.png';
import Overlay from '../util/overlay';

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

const BikeMap: React.FC<BikeMapProps> = ({ className, isLoggedIn }) => {
  const { MAP, BUCHUNGEN } = useContext(LanguageContext);

  const [viewport, handleViewportChange] = useCachedViewport();
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [stations] = useStations();
  const [, loadStationDetail] = useOpenableStation();
  const { booking, fetchBooking, cancelBooking } = useBooking();

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

      bookBike(selectedStation)
        .then(() => {
          closePopup();
          loadStationDetail(selectedStation);
          setSelectedStation(selectedStation);
        })
        .catch(err => {
          console.error("Error while reserving bike:", err);
          toast(MAP.POPUP.RENT_DIALOG.ALERT.DEFAULT_ERR, { type: 'error' });
        });
    },
    [selectedStation, MAP],
  );
  const handleCancelBooking = useCallback(
    () => {
      fetchBooking().then(() => {
        if (!booking) {
          throw new Error("Trying to cancel a booking, but no bike booked.");
        }

        const wasBookingForCurrentStation = booking.stationId === selectedStation;
        cancelBooking()
          .then(() => {
            closePopup();
            if (!wasBookingForCurrentStation && selectedStation) {
              loadStationDetail(selectedStation);
              setSelectedStation(selectedStation);
            }
          })
          .catch(err => {
            console.error("Error while canceling a booking:", err);
            toast(BUCHUNGEN.ALERT.LOAD_CURR_BOOKING_ERR, { type: 'error' });
          });
      });
    },
    [booking, selectedStation, BUCHUNGEN],
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
          const code = (err as InvalidStatusCodeError).statusCode;
          const message = code === 403
            ? MAP.POPUP.RENT_DIALOG.ALERT.INVALID_PIN
            : code === 406
              ? MAP.POPUP.RENT_DIALOG.ALERT.SLOT_LOCKED
              : MAP.POPUP.RENT_DIALOG.ALERT.DEFAULT_ERR;

          toast(message, { type: 'error' });
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
          attribution={ATTRIBUTION}
          detectRetina={true}
          maxZoom={18}
          url={TILE_URL}
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
          onCancelBooking={handleCancelBooking}
          onRentBike={handleRent}
        />
      </Overlay>
    </>
  );
};

export default BikeMap;

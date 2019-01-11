import { navigate, RouteComponentProps } from '@reach/router';
import { icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { toast } from 'react-toastify';

import { Slots, Station, StationWithAddress } from '../../model';
import {
  getAllStations,
  getSingleStation,
  getSlotInfo,
  rentBike,
  reserveBike,
} from '../../model/stations';
import { hasCurrentBooking } from '../../model/transaction';
import { LanguageContext } from '../../resources/language';
import logo from '../../resources/logo.png';

import './bike-map.scss';
import StationPopup from './station-popup';

interface BikeMapProps {
  isLoggedIn: boolean;
}

interface BikeMapState {
  hasBooking: boolean;
  initialMapLocation: [number, number];
  initialMapZoom: number;
  stationOpened: {
    slots: Slots;
    station: StationWithAddress;
  } | null;
  stations: Station[];
}

interface BikeMapBodyProps extends BikeMapProps, BikeMapState {
  onClosePopup: () => void;
  onOpenStationPopup: (stationId: number) => void;
  onRent: (pin: string, stationId: number, slotId: number) => void;
  onReserve: (stationId: number) => void;
  onViewportChange: (viewport: { center: [number, number], zoom: number }) => void;
}

const STORAGE_VIEWPORT_KEY = 'velocity/viewport';

const aachenLatLng: [number, number] = [50.77403035497566, 6.084194183349609];
const stationIcon = icon({
  iconUrl: logo,
  iconSize: [25.3, 29.37],
});

const BikeMapBody: React.SFC<BikeMapBodyProps> = ({
  hasBooking,
  initialMapLocation,
  initialMapZoom,
  isLoggedIn,
  stationOpened,
  stations,

  onClosePopup,
  onOpenStationPopup,
  onRent,
  onReserve,
  onViewportChange,
}) => (
  <Map
    center={initialMapLocation}
    zoom={initialMapZoom}
    maxZoom={18}
    onViewportChanged={onViewportChange}
  >
    <TileLayer
      attribution={'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}
      detectRetina={true}
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
            stationOpened && stationOpened.station.stationId === station.stationId
              ? stationOpened
              : null
          }
          hasBooking={hasBooking}
          isLoggedIn={isLoggedIn}
          station={station}
          onClose={onClosePopup}
          onOpen={onOpenStationPopup}
          onRent={onRent}
          onReserve={onReserve}
        />
      </Marker>
    ))}
  </Map>
);

class BikeMap extends React.Component<
  RouteComponentProps & BikeMapProps,
  BikeMapState
> {
  static contextType = LanguageContext;

  private static storage: Storage =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
      ? localStorage
      : sessionStorage;

  context!: React.ContextType<typeof LanguageContext>;
  state = {
    hasBooking: false,
    initialMapLocation: aachenLatLng,
    initialMapZoom: 14,
    stationOpened: null,
    stations: [],
  };

  componentDidMount() {
    this.loadPreviousMapViewport();
    this.loadStations();
  }

  render() {
    return (
      <BikeMapBody
        {...this.state}
        isLoggedIn={this.props.isLoggedIn}
        onClosePopup={this.handleCloseStation}
        onOpenStationPopup={this.handleOpenStation}
        onRent={this.handleRent}
        onReserve={this.handleReserve}
        onViewportChange={this.handleViewportChange}
      />
    );
  }

  private loadPreviousMapViewport() {
    const viewport = BikeMap.storage.getItem(STORAGE_VIEWPORT_KEY);
    if (!viewport) {
      return;
    }

    const { center, zoom } = JSON.parse(viewport);
    this.setState({
      initialMapLocation: center,
      initialMapZoom: zoom,
    });
  }

  private async loadStations() {
    try {
      const stations = await getAllStations();
      this.setState({ stations });
    } catch (err) {
      toast(
        this.context.MAP.ALERT.STATION_LOAD,
        { type: 'error' },
      );
    }
  }

  private handleCloseStation = () => this.setState({ stationOpened: null });

  private handleOpenStation = async (stationId: number) => {
    try {
      const [hasBooking, detailedStation, slotInfo] = await Promise.all([
        hasCurrentBooking(),
        getSingleStation(stationId),
        getSlotInfo(stationId),
      ]);

      if (!detailedStation || !slotInfo) {
        throw new Error(`Failed fetching station ${stationId}.`);
      }

      this.setState({
        hasBooking,
        stationOpened: {
          station: detailedStation,
          slots: slotInfo,
        },
      });
    } catch (err) {
      toast(
        this.context.MAP.ALERT.STATION_DETAILS,
        { type: 'error' },
      );
    }
  }

  private handleRent = async (pin: string, stationId: number, slotId: number) => {
    try {
      await rentBike(pin, stationId, slotId);
      navigate('/bookings');
    } catch (err) {
      toast(
        this.context.MAP.POPUP.RENT_DIALOG.ALERT.DEFAULT_ERR,
        { type: 'error' },
      );
    }
  }

  private handleReserve = async (stationId: number) => {
    await reserveBike(stationId);
    navigate('/bookings');
  }

  private handleViewportChange = viewport => {
    BikeMap.storage.setItem(STORAGE_VIEWPORT_KEY, JSON.stringify(viewport));
  }
}

export default BikeMap;

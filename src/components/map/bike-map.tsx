import { navigate, RouteComponentProps } from '@reach/router';
import { icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';

import {
  getAllStations,
  getSingleStation,
  getSlotInfo,
  rentBike,
  reserveBike,
  Slots,
  Station,
  StationWithAddress,
} from '../../model/stations';
import logo from '../../resources/logo.png';

import './bike-map.scss';
import StationPopup from './station-popup';

interface BikeMapProps {
  isLoggedIn: boolean;
}

interface BikeMapState {
  stationOpened: {
    slots: Slots;
    station: StationWithAddress;
  } | null;
  stations: Station[];
}

interface BikeMapBodyProps extends BikeMapProps, BikeMapState {
  onOpenStationPopup: (stationId: number) => void;
  onRent: (pin: string, stationId: number, slotId: number) => void;
  onReserve: (stationId: number) => void;
}

const stationIcon = icon({
  iconUrl: logo,
  iconSize: [25.3, 29.37],
});

const BikeMapBody: React.SFC<BikeMapBodyProps> = ({
  isLoggedIn,
  stationOpened,
  stations,

  onOpenStationPopup,
  onRent,
  onReserve,
}) => (
  <Map
    center={[50.77403035497566, 6.084194183349609]}
    zoom={14}
    maxZoom={18}
  >
    <TileLayer
      attribution={'&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}
      detectRetina={true}
      url="https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
    />

    {stations.map(station => (
      <Marker
        icon={stationIcon}
        position={[station.locationLatitude, station.locationLongitude]}
      >
        <StationPopup
          key={station.stationId}
          detail={
            stationOpened && stationOpened.station.stationId === station.stationId
              ? stationOpened
              : null
          }
          isLoggedIn={isLoggedIn}
          station={station}
          onOpenStationPopup={onOpenStationPopup}
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
  state = {
    stationOpened: null,
    stations: [],
  };

  componentDidMount() {
    getAllStations()
      .then(stations => this.setState({ stations }));
  }

  render() {
    return (
      <BikeMapBody
        {...this.state}
        isLoggedIn={this.props.isLoggedIn}
        onOpenStationPopup={this.handleOpenStation}
        onRent={this.handleRent}
        onReserve={this.handleReserve}
      />
    );
  }

  private handleOpenStation = async (stationId: number) => {
    const [detailedStation, slotInfo] = await Promise.all([
      getSingleStation(stationId),
      getSlotInfo(stationId),
    ]);

    if (!detailedStation || !slotInfo) {
      throw new Error(`Failed fetching station ${stationId}.`);
    }

    this.setState({
      stationOpened: {
        station: detailedStation,
        slots: slotInfo,
      },
    });
  }

  private handleRent = async (pin: string, stationId: number, slotId: number) => {
    await rentBike(pin, stationId, slotId);
    navigate('/bookings');
  }

  private handleReserve = async (stationId: number) => {
    await reserveBike(stationId);
    navigate('/bookings');
  }
}

export default BikeMap;

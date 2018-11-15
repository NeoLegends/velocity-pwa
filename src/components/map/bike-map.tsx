import { RouteComponentProps } from '@reach/router';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Map, TileLayer } from 'react-leaflet';

import {
  getAllStations,
  getSingleStation,
  getSlotInfo,
  Slots,
  Station,
  StationWithAddress,
} from '../../model/stations';

import './bike-map.scss';
import StationMarker from './station-marker';

interface BikeMapBodyProps extends BikeMapState {
  onOpenStationPopup: (stationId: number) => void;
  onRent: (stationId: number) => void;
  onReserve: (stationId: number) => void;
}

interface BikeMapState {
  stationOpened: {
    slots: Slots;
    station: StationWithAddress;
  } | null;
  stations: Station[];
}

const BikeMapBody: React.SFC<BikeMapBodyProps> = ({
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
      <StationMarker
        key={station.stationId}
        detail={
          stationOpened && stationOpened.station.stationId === station.stationId
            ? stationOpened
            : null
        }
        station={station}
        onOpenStationPopup={onOpenStationPopup}
        onRent={onRent}
        onReserve={onReserve}
      />
    ))}
  </Map>
);

class BikeMap extends React.Component<RouteComponentProps, BikeMapState> {
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

  private handleRent = (stationId: number) => alert(`Rent station ${stationId}.`);

  private handleReserve = (stationId: number) => alert(`Reserve station ${stationId}.`);
}

export default BikeMap;

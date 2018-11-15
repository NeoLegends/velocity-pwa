import { RouteComponentProps } from '@reach/router';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { icon } from 'leaflet';
import { Map, Marker, TileLayer } from 'react-leaflet';

import { getAllStations, Station } from '../model/map';
import logo from '../resources/logo.png';

import './bike-map.scss';

interface BikeMapBodyProps extends BikeMapState {

}

interface BikeMapState {
  stations: Station[];
}

const stationIcon = icon({
  iconUrl: logo,
  iconSize: [25.3, 29.37],
});

const BikeMapBody: React.SFC<BikeMapBodyProps> = props => {
  const { stations } = props;

  return (
    <Map
      center={[50.77403035497566, 6.084194183349609]}
      zoom={14}
      maxZoom={18}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        detectRetina={true}
        url="https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
      />

      {stations.map(stat => (
        <Marker
          icon={stationIcon}
          position={[stat.locationLatitude, stat.locationLongitude]}
        />
      ))}
    </Map>
  );
};

class BikeMap extends React.Component<RouteComponentProps, BikeMapState> {
  state = {
    stations: [],
  };

  componentDidMount() {
    getAllStations()
      .then(stations => this.setState({ stations }));
  }

  render() {
    return <BikeMapBody {...this.state}/>;
  }
}

export default BikeMap;

import { RouteComponentProps } from '@reach/router';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

import { getAllStations, Station } from '../model/map';

import './bike-map.scss';

interface BikeMapBodyProps extends BikeMapState {

}

interface BikeMapState {
  stations: Station[];
}

const BikeMapBody: React.SFC<BikeMapBodyProps> = props => {
  return (
    <Map>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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

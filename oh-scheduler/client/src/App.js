import './css/App.css';

import React from "react";
import MapArea from "./MapArea";
import InfoArea from './InfoArea';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      center: {
        lat: 47.6062,
        lng: -122.3321
      },
      activeHome: null,
      route: null,
      viewOpenHouseDate: null,
      viewOpenHouseDateOptions: []
    };

    this.handleClickMarker = this.handleClickMarker.bind(this);
    this.handleClickList = this.handleClickList.bind(this);
    this.setOpenHouseDateOptions = this.setOpenHouseDateOptions.bind(this);
    this.setOpenHouseDate = this.setOpenHouseDate.bind(this);
    this.recenterMap = this.recenterMap.bind(this);
    this.showRouteOnMap = this.showRouteOnMap.bind(this);
  }

  handleClickMarker(home) {
    this.setState({ activeHome: home });
  }

  handleClickList(home) {
    this.setState({ activeHome: home }, () => {
      this.recenterMap(this.state.activeHome);
    });
  }

  setOpenHouseDateOptions(options) {
    const currentOptions = [...this.state.viewOpenHouseDateOptions];
    options.forEach(option => {
      if (!currentOptions.includes(option)) {
        currentOptions.push(option);
      }
    });
    currentOptions.sort((a, b) => {
      return new Date(a) - new Date(b);
    });
    this.setState({ viewOpenHouseDateOptions: currentOptions });
    if (this.state.viewOpenHouseDate === null && currentOptions.length > 0) {
      this.setState({ viewOpenHouseDate: currentOptions[0] });
    }
  }

  setOpenHouseDate(date) {
    console.log(`Set to display open house on ${date}`);
    this.setState(
      {
        viewOpenHouseDate: date,
        activeHome: null,
        route: null,
      });
  }

  recenterMap(home) {
    const center = {
      lat: home.latLong.value.latitude,
      lng: home.latLong.value.longitude
    }
    this.setState({ center: null }, () => {
      this.setState({ center: center });
    });
  }

  showRouteOnMap(route) {
    this.setState({ route: route })
  }

  render() {
    return (
      <div className="App">
        <div className="row">
          <div id="map" className="col">
            <div id="title" className="row">Open House Touring Schedule Helper</div>
            <div className="row">
              <MapArea
                handleClickMarker={this.handleClickMarker}
                setOpenHouseDateOptions={this.setOpenHouseDateOptions}
                center={this.state.center}
                route={this.state.route}
                viewOpenHouseDate={this.state.viewOpenHouseDate} />
            </div>
          </div>
          <div id="info" className="col col-lg-3">
            <InfoArea
              setOpenHouseDate={this.setOpenHouseDate}
              handleClickList={this.handleClickList}
              showRouteOnMap={this.showRouteOnMap}
              activeHome={this.state.activeHome}
              viewOpenHouseDate={this.state.viewOpenHouseDate}
              viewOpenHouseDateOptions={this.state.viewOpenHouseDateOptions} />
          </div>
        </div>

      </div>
    );
  }
}

export default App;

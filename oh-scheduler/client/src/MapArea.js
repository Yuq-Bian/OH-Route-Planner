import './css/MapArea.css';

import React from "react";
import GoogleMapReact from "google-map-react";
import { dataServiceFacade } from "./data/LocalServerFacade";
import Marker from './Marker';
import { env } from "./config/Env.js";


class MapArea extends React.Component {

  constructor(props) {
    super(props);
    this.tick = 0;
    this.handleClickMarker = props.handleClickMarker;
    this.setOpenHouseDateOptions = props.setOpenHouseDateOptions;

    this.map = null;
    this.directionsService = null;
    this.directionsRenderer = null;
    this.lastDrawRouteId = null;

    this.state = {
      center: props.center,
      zoom: 13,
      homes: [],
      route: props.route,
      viewOpenHouseDate: props.viewOpenHouseDate,
    };

    this.apiIsLoaded = this.apiIsLoaded.bind(this);
    this.onBoundsChanged = this.onBoundsChanged.bind(this);
    this.updateHomesBasedOnBounds = this.updateHomesBasedOnBounds.bind(this);
    this.translatePrice = this.translatePrice.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.route && nextProps.route == null) {
      console.log("Clear Existing Route");
      this.directionsRenderer.setMap(null);
    }

    this.setState(
      {
        center: nextProps.center,
        route: nextProps.route,
        viewOpenHouseDate: nextProps.viewOpenHouseDate,
      }
    );
  }

  apiIsLoaded(map, maps) {
    const bounds = map.getBounds();
    console.log(bounds);
    console.log("Initialize Map");
    this.updateHomesBasedOnBounds(bounds.wb.h, bounds.Sa.h, bounds.wb.j, bounds.Sa.j);

    this.map = map;

    map.addListener("bounds_changed", () => {
      const bounds = map.getBounds();
      this.onBoundsChanged(bounds.wb.h, bounds.Sa.h, bounds.wb.j, bounds.Sa.j);
    });
  }

  async onBoundsChanged(topLeftLat, topLeftLng, bottomRightLat, bottomRightLng) {

    this.tick += 1;
    let nowTick = this.tick;

    setTimeout(
      async () => {
        if (this.tick === nowTick) {
          console.log(`Bounds set to: topleft: lat:${topLeftLat} lng:${topLeftLng} bottomright: lat:${bottomRightLat} lng:${bottomRightLng}`);
          await this.updateHomesBasedOnBounds(topLeftLat, topLeftLng, bottomRightLat, bottomRightLng);
        }
      },
      3000
    )
  }

  async updateHomesBasedOnBounds(topLeftLat, topLeftLng, bottomRightLat, bottomRightLng) {
    const listingData = await dataServiceFacade.getOpenHouseListing(topLeftLat, topLeftLng, bottomRightLat, bottomRightLng);
    const homes = listingData.payload.homes;
    this.setState({ homes: homes });
    const openHouseDateOptionsSet = new Set();
    homes.forEach(home => {
      const date = home.openHouseStartFormatted.split(',')[0];
      openHouseDateOptionsSet.add(date);
    });
    this.setOpenHouseDateOptions(Array.from(openHouseDateOptionsSet));
  }

  translatePrice(price) {
    if (price < 1000) {
      return price;
    }
    else if (price < 1000000) {
      let result = (price / 1000).toFixed(0);
      return result + "K";
    }
    else {
      let result = (price / 1000000).toFixed(2);
      return result + "M";
    }
  }

  render() {

    if (this.state.route) {
      console.log("We have a route pending drawing.");
      console.log(this.state.route);
      if (this.lastDrawRouteId && this.lastDrawRouteId === this.state.route.routeId) {
        console.log("Same route as last. No needs to update.");
      } else {
        console.log("New route! Update!");
        this.lastDrawRouteId = this.state.route.routeId;

        // Reset previous route if exist
        this.directionsRenderer && this.directionsRenderer.setMap(null);

        this.directionsService = new window.google.maps.DirectionsService();
        this.directionsRenderer = new window.google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(this.map);

        const waypts = [];
        this.state.route.wayPoints.forEach(waypoint => {
          waypts.push({
            location: waypoint,
            stopover: true,
          });
        });
    
        this.directionsService.route(
          {
            origin: this.state.route.origin,
            destination: this.state.route.destination,
            waypoints: waypts,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              this.directionsRenderer.setDirections(result);
            } else {
              console.error(`Error fetching directions ${result}`);
            }
          }
        );
      }
    }

    return (
      <div id="mapContainer">
        <GoogleMapReact
          bootstrapURLKeys={{
            key: env.GOOGLE_MAPS_API_KEY
          }}
          center={this.state.center}
          zoom={this.state.zoom}
          onGoogleApiLoaded={({ map, maps }) => this.apiIsLoaded(map, maps)}>
          {
            this.state.homes && this.state.homes.map(home => {
              if (home.openHouseStartFormatted.split(',')[0] === this.state.viewOpenHouseDate) {
                return <Marker
                  key={home.mlsId.value}
                  text={this.translatePrice(home.price.value)}
                  handleClickMarker={() => this.handleClickMarker(home)}
                  lat={home.latLong.value.latitude}
                  lng={home.latLong.value.longitude} />;
              }
            })
          }
        </GoogleMapReact>
      </div>
    );
  }
}

export default MapArea;
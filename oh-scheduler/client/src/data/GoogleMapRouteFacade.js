import { mockDistanceData } from './MockData';

export const routeServiceFacade = {

  getDistanceMatrix(homes, callback) {
    var points = [];
    homes.forEach(home => {
      const point = {
        lat: home.latLong.value.latitude,
        lng: home.latLong.value.longitude,
      };

      points.push(point);
    });

    const request = {
      origins: points,
      destinations: points,
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    };

    const service = new window.google.maps.DistanceMatrixService();

    console.log("Request Google DistanceMatrix");
    console.log(request);

    service.getDistanceMatrix(request, (response) => {
      console.log("Real getDistanceMatrix");
      console.log(response);
      var homeGraph = [];
      for (let i = 0; i < homes.length; i++) {
        const home = homes[i];
        const node = {
          id: home.mlsId.value,
          stay: home.stayTime * 60,
          openStartTime: home.openHouseStart / 1000,
          openEndTime: home.openHouseEnd / 1000,
          travelTimes: [],
        };
        const row = response.rows[i];
        for (let j = 0; j < homes.length; j++) {
          const travelTime = {
            destinationId: homes[j].mlsId.value,
            time: row.elements[j].duration.value,
          }
          node.travelTimes.push(travelTime);
        }
        homeGraph.push(node);
      }

      callback(homeGraph);
    });
  },

  getMockDistanceMatrix(homes, callback) {
    const response = mockDistanceData;
    console.log(response);

    var homeGraph = [];
    for (let i = 0; i < homes.length; i++) {
      const home = homes[i];
      const node = {
        id: home.mlsId.value,
        stay: home.stayTime * 60,
        openStartTime: home.openHouseStart / 1000,
        openEndTime: home.openHouseEnd / 1000,
        travelTimes: [],
      };
      const row = response.rows[i];
      for (let j = 0; j < homes.length; j++) {
        const travelTime = {
          destinationId: homes[j].mlsId.value,
          time: row.elements[j].duration.value,
        }
        node.travelTimes.push(travelTime);
      }
      homeGraph.push(node);
    }

    callback(homeGraph);
  },
}
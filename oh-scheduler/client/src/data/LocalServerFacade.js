import { mockListingData } from './MockData';

export const dataServiceFacade = {

  async getOpenHouseListing(topLeftLat, topLeftLng, bottomRightLat, bottomRightLng) {
      const body = {
          tl_lat: topLeftLat,
          tl_lng: topLeftLng,
          br_lat: bottomRightLat,
          br_lng: bottomRightLng
      };
      const response = await fetch(
          "http://localhost:3001/listing",
          {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json', 
              },
              body: JSON.stringify(body),
          });
      const data = await response.text();
      return JSON.parse(data);
  },

  async getMockOpenHouseListing(topLeftLat, topLeftLng, bottomRightLat, bottomRightLng) {
    return mockListingData;
  },

}
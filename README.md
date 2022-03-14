# Open House Route Planner
- Introduction

   The project is a route scheduling web application based on a real world scenario. The idea is derived from my open houses visiting experience. Users can select several open houses they plan to see on the website. Then the app can provide a best route that visits most open houses in least driving time according to the open time window, estimated visiting time and location of the open house.
</br>The project integrates with Google Maps API and Redfin real-time open houses data with more than 1M listings. Web is implemented with React and Bootstrap.

- Demo

   The `RP Demo.mp4` shows the project.

- Prerequisites

   Before you get started, make sure to:

   - Install latest npm on your machine. Please follow this [document](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

   - Setup a Google Cloud Platform account and generate an API Key.
      1. Follow this [document](https://developers.google.com/maps/get-started#create-project) to create a project on Google Cloud Platform.
      2. Follow this [document](https://developers.google.com/maps/get-started#enable-api-sdk) to enable `Maps JavaScript API`, `Distance Matrix API`, and `Directions API` for your project created in previous step.
      3. Follow this [document](https://developers.google.com/maps/get-started#api-key) to issue an API Key with above 3 APIs access granted.
      4. Replace `YOUR_API_KEY` in `oh-scheduler/src/config/Env.js` file with your API key.

- Run Data Server

   Data Server is the backend service of this project. Currently, the major scenario for this service is to act as the proxy server to fetch real-time Redfin open house data. To run Data Server on your local machine, you need to:

   1. Open a CMD or PowerShell, navigate to the `oh-scheduler` folder of this project.
   2. Run `npm install`.
   3. Run `npm start`. The console will prompt Data Server is running on `localhost:3001`.
   4. Please do not close the console when you run the Web Client.


- Run Web Client

   Web Client is the front end of this project. To run Web Client on your local machine, you need to:

   1. Open another CMD or PowerShell, navigate to the `oh-scheduler/client` folder of this project.
   2. Run `npm install`.
   3. Run `npm start`. The console will prompt Web Client is running on `localhost:3000`.
   4. Open your favorite browser, open `http://localhost:3000`, you can start playing with this project.

import './css/InfoArea.css';

import React from "react";
import ActiveHome from './ActiveHome';
import HomeList from './HomeList';
import ScheduleButton from './ScheduleButton';
import { routeServiceFacade } from './data/GoogleMapRouteFacade';
import DateSelector from './DateSelector';
import { MAX_SUPPORTED_HOMELIST_SIZE, UNREACHABLE_HOME_INDEX } from './Const'

class InfoArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeHome: props.activeHome,
      selectedHomes: [],
      viewOpenHouseDate: props.viewOpenHouseDate,
      viewOpenHouseDateOptions: props.viewOpenHouseDateOptions,
    };

    this.setOpenHouseDate = props.setOpenHouseDate;
    this.handleClickList = props.handleClickList;
    this.showRouteOnMap = props.showRouteOnMap;

    this.handleAddToList = this.handleAddToList.bind(this);
    this.handleRemoveHome = this.handleRemoveHome.bind(this);
    this.handleSchedule = this.handleSchedule.bind(this);
    this.calculateRoutePath = this.calculateRoutePath.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        activeHome: nextProps.activeHome,
        viewOpenHouseDate: nextProps.viewOpenHouseDate,
        viewOpenHouseDateOptions: nextProps.viewOpenHouseDateOptions,
      }
    );

    if (nextProps.activeHome === null) {
      this.state.selectedHomes.forEach(home => {
        home.indexInPath = null;
      });
  
      this.setState(
        {
          selectedHomes: [],
        }
      );
    }
  }

  handleAddToList(newHome) {
    var selected = false;
    this.state.selectedHomes.forEach(home => {
      if (home.mlsId.value === newHome.mlsId.value) {
        selected = true;
        home.stayTime = newHome.stayTime;
      }
    });

    if (!selected) {
      if (this.state.selectedHomes.length >= MAX_SUPPORTED_HOMELIST_SIZE) {
        alert(`Add to List Failed! Maximum of ${MAX_SUPPORTED_HOMELIST_SIZE} Houses are supported!`);
        return;
      }
      this.state.selectedHomes.push(newHome);
    }

    this.setState({ selectedHomes: this.state.selectedHomes });
  }

  handleRemoveHome(home) {
    home.indexInPath = null;
    const index = this.state.selectedHomes.indexOf(home);
    if (index > -1) {
      this.state.selectedHomes.splice(index, 1);
    }

    this.setState({ selectedHomes: this.state.selectedHomes });
  }

  handleSchedule() {
    if (this.state.selectedHomes.length < 2) {
      this.showRouteOnMap(null);
    } else {
      routeServiceFacade.getDistanceMatrix(this.state.selectedHomes, this.calculateRoutePath);
    }
  }

  calculateRoutePath(homeGraph) {

    console.log("Home Graph generated for route planing.");
    console.log(homeGraph);

    const nodeCount = homeGraph.length;
    // The ith element in minDrivingTimes indicates the mininum driving time when visiting i nodes
    var minDrivingTimes = [];
    var visited = [];
    for (let i = 0; i < nodeCount; i++) {
      minDrivingTimes.push({
        path: [],
        drivingTime: Number.MAX_VALUE,
      });
      visited[i] = false;
    }

    // Calculate best path
    this.calculateRoutePathOnHomeGraph(nodeCount, homeGraph, minDrivingTimes, 0, visited, [], 0, -1, 0);

    var selectedPath;
    for (let i = nodeCount - 1; i >= 0; i--) {
      if (minDrivingTimes[i].drivingTime < Number.MAX_VALUE) {
        selectedPath = minDrivingTimes[i].path;
        break;
      }
    }

    console.log(minDrivingTimes);

    this.state.selectedHomes.forEach(home => {
      home.indexInPath = UNREACHABLE_HOME_INDEX;
    });

    for (let i = 0; i < selectedPath.length; i++) {
      this.state.selectedHomes[selectedPath[i]].indexInPath = i;
    }

    this.state.selectedHomes.sort((a, b) => {
      return a.indexInPath - b.indexInPath;
    });
    this.setState({ selectedHomes: this.state.selectedHomes });

    // Construct a route
    const selectedHomesCount = this.state.selectedHomes.length;

    var routeId = "";
    this.state.selectedHomes.forEach(home => {
      routeId = routeId + home.mlsId.value;
    });

    const origin = {
      lat: this.state.selectedHomes[0].latLong.value.latitude,
      lng: this.state.selectedHomes[0].latLong.value.longitude,
    };

    var lastReachableHouseIndex = selectedHomesCount - 1;
    for (let index = 0; index < selectedHomesCount; index++) {
      if (this.state.selectedHomes[index].indexInPath === UNREACHABLE_HOME_INDEX) {
        break;
      } else {
        lastReachableHouseIndex = index;
      }
    }

    const destination = {
      lat: this.state.selectedHomes[lastReachableHouseIndex].latLong.value.latitude,
      lng: this.state.selectedHomes[lastReachableHouseIndex].latLong.value.longitude,
    };

    var wayPoints = [];
    for (let index = 1; index < lastReachableHouseIndex; index++) {
      const point = {
        lat: this.state.selectedHomes[index].latLong.value.latitude,
        lng: this.state.selectedHomes[index].latLong.value.longitude,
      };

      wayPoints.push(point);
    }

    const route = {
      routeId: routeId,
      origin: origin,
      destination: destination,
      wayPoints: wayPoints,
    };

    this.showRouteOnMap(route);
  }

  calculateRoutePathOnHomeGraph(totalNodeCount, homeGraph, minDrivingTimes, visitedNodeCount, visited, path, nowTime, nowAtNodeIndex, totalDrivingTimeNow) {
    for (let i = 0; i < totalNodeCount; i++) {
      if (visited[i] === false && nowTime + homeGraph[i].stay <= homeGraph[i].openEndTime) {
        visited[i] = true;
        const previousTime = nowTime;
        const previousTotalDrivingTime = totalDrivingTimeNow;

        if (nowAtNodeIndex < 0) {
          // No previous node
          if (nowTime <= homeGraph[i].openStartTime) {
            nowTime = homeGraph[i].openStartTime;
          }
        } else {
          // Go to node i from a previous node
          const travelTime = homeGraph[nowAtNodeIndex].travelTimes[i].time;
          nowTime += travelTime;
          if (nowTime <= homeGraph[i].openStartTime) {
            nowTime = homeGraph[i].openStartTime;
          }  

          totalDrivingTimeNow += travelTime;
        }
        nowTime += homeGraph[i].stay;
        visitedNodeCount += 1;
        path.push(i);

        if (totalDrivingTimeNow < minDrivingTimes[visitedNodeCount - 1].drivingTime) {
          minDrivingTimes[visitedNodeCount - 1].drivingTime = totalDrivingTimeNow;
          minDrivingTimes[visitedNodeCount - 1].path = [...path];
        }

        this.calculateRoutePathOnHomeGraph(totalNodeCount, homeGraph, minDrivingTimes, visitedNodeCount, visited, path, nowTime, i, totalDrivingTimeNow);

        visited[i] = false;
        nowTime = previousTime;
        totalDrivingTimeNow = previousTotalDrivingTime;
        visitedNodeCount -= 1;
        path.pop();
      }
    }
  }

  render() {
    return (
      <div id="infoContainer" className="d-flex flex-column">
        {
          this.state.viewOpenHouseDateOptions && this.state.viewOpenHouseDateOptions.length > 0 && (
            <div className="row">
              <DateSelector
                viewOpenHouseDate={this.state.viewOpenHouseDate}
                viewOpenHouseDateOptions={this.state.viewOpenHouseDateOptions}
                setOpenHouseDate={this.setOpenHouseDate} />
            </div>
          )
        }
        <div className="row">
          {
            this.state.activeHome && (
              <ActiveHome
                activeHome={this.state.activeHome}
                handleAddToList={this.handleAddToList} />
            )
          }
        </div>
        <div className="row flex-fill hideScrollBar" id="homeListSection">
          <HomeList
            selectedHomes={this.state.selectedHomes}
            handleClickList={this.handleClickList}
            handleRemoveHome={this.handleRemoveHome} />
        </div>
        <div className="row mt-auto">
          <ScheduleButton handleSchedule={this.handleSchedule} />
        </div>
      </div>
    );
  }
}

export default InfoArea;
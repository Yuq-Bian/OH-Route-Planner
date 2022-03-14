import './css/HomeList.css';

import React from "react";
import { UNREACHABLE_HOME_INDEX } from './Const'

class HomeList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedHomes: props.selectedHomes,
    };

    this.handleRemoveHome = props.handleRemoveHome;
    this.handleClickList = props.handleClickList;

    this.handleClickRemoveButton = this.handleClickRemoveButton.bind(this);
    this.handleClickListCell = this.handleClickListCell.bind(this);
    this.getOpenHouseTimeInfo = this.getOpenHouseTimeInfo.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        selectedHomes: nextProps.selectedHomes,
      }
    );
  }

  handleClickRemoveButton(home) {
    this.handleRemoveHome(home);
  }

  handleClickListCell(home) {
    this.handleClickList(home);
  }

  getOpenHouseTimeInfo(home) {
    const sashes = home.sashes;
    var openHouseTime = "Open House";
    sashes.forEach(sash => {
      if (sash.sashType === 10) {
        openHouseTime = sash.openHouseText;
      }
    });

    return openHouseTime;
  }

  render() {

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });

    return (
      <div id="homeListContainer">
        {
          this.state.selectedHomes && this.state.selectedHomes.map(home => {
            return (
              <div className="row homeListCell" key={home.mlsId.value} onClick={() => this.handleClickListCell(home)}>
                <div className="row homeListCellElement">
                  <div className="col col-lg-8 homeListCellPrice">
                    {
                      home.indexInPath != null && home.indexInPath === UNREACHABLE_HOME_INDEX && (
                        <span class="badge rounded-pill bg-warning text-dark">!</span>
                      )
                    }
                    {
                      home.indexInPath != null && home.indexInPath != UNREACHABLE_HOME_INDEX && (
                        <span class="badge rounded-pill bg-danger">{String.fromCharCode('A'.charCodeAt(0) + home.indexInPath)}</span>
                      )
                    }
                    {
                      `${formatter.format(home.price.value)}`
                    }
                  </div>
                  <div className="col col-lg-4 homeListCellRemoveButton">
                    {
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={(e) => { this.handleClickRemoveButton(home); e.stopPropagation(); }}>Remove</button>
                    }
                  </div>
                </div>
                <div className="row homeListCellElement homeListCellAddress">
                  {
                    `${home.streetLine.value}, ${home.city}, ${home.state} ${home.zip}`
                  }
                </div>
                <div className="row homeListCellElement homeListCellOpenInfo">
                  {this.getOpenHouseTimeInfo(home)}
                </div>
                <div className="row homeListCellElement">
                  <div className="col col-lg-8 homeListCellStayTimeTitle">
                    {
                      "Estimate View Time"
                    }
                  </div>
                  <div className="col col-lg-4 homeListCellStayTime">
                    {
                      `${home.stayTime} Mins`
                    }
                  </div>
                  {
                    home.indexInPath != null && home.indexInPath === UNREACHABLE_HOME_INDEX && (
                      <div className="row homeListCellElement homeListCellUnreachableInfo">
                        Sorry, we can NOT find a route to include this house. Please update your list or edit view time of each house.
                      </div>
                    )
                  }
                </div>

              </div>
            );
          })
        }
      </div>
    );
  }
}

export default HomeList;
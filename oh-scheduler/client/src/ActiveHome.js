import './css/ActiveHome.css';

import React from "react";

class ActiveHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeHome: props.activeHome,
      stayTime: props.activeHome.stayTime,
    };

    this.handleAddToList = props.handleAddToList;

    this.handleClickAddButton = this.handleClickAddButton.bind(this);
    this.handleChangeStayTime = this.handleChangeStayTime.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        activeHome: nextProps.activeHome,
        stayTime: nextProps.activeHome.stayTime,
      }
    );
  }

  handleClickAddButton() {
    this.state.activeHome.stayTime = this.state.stayTime;
    this.handleAddToList(this.state.activeHome);
  }

  handleChangeStayTime(event) {
    this.setState({ stayTime: event.target.value });
  }

  render() {
    const mlsId = this.state.activeHome.mlsId.value;
    const shortPartitionId = mlsId.substring(mlsId.length - 3);
    const photoId = (this.state.activeHome.photos.value.split(',')[0]).split(':')[1];
    const imgUrl = `https://ssl.cdn-redfin.com/photo/${this.state.activeHome.photos.level}/bigphoto/${shortPartitionId}/${mlsId}_${photoId}.jpg`;
    const redfinUrl = `https://www.redfin.com${this.state.activeHome.url}`;

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });
    const price = formatter.format(this.state.activeHome.price.value);

    const sashes = this.state.activeHome.sashes;
    var openHouseTime = "Open House";
    sashes.forEach(sash => {
      if (sash.sashType === 10) {
        openHouseTime = sash.openHouseText;
      }
    });

    if (this.state.stayTime === undefined) {
      this.state.stayTime = 10;
    }

    return (
      this.state.activeHome && (
        <div id="activeHomeContainer">
          <div className="row activeHomeElement" id="activeHomeImg">
            <img src={imgUrl} alt={this.state.activeHome.streetLine.value} />
          </div>
          <div className="row">
            <div className="col col-lg-4 activeHomeElement" id="activeHomePrice">
              {
                `${price}`
              }
            </div>
            <div className="col col-lg-8 activeHomeElement" id="activeHomeInfo">
              {
                `${this.state.activeHome.beds} Beds ${this.state.activeHome.baths} Baths  ${this.state.activeHome.sqFt.value} Sq.Ft.`
              }
            </div>
          </div>
          <div className="row activeHomeElement" id="activeHomeAddr">
            {
              `${this.state.activeHome.streetLine.value}, ${this.state.activeHome.city}, ${this.state.activeHome.state} ${this.state.activeHome.zip}`
            }
          </div>
          <div className="row activeHomeElement" id="activeHomeLink">
            {
              <a href={redfinUrl} target="_blank" rel="noopener noreferrer">VIEW IN REDFIN</a>
            }
          </div>
          <div className="row activeHomeElement" id="activeHomeOpenHouseTime">
            {openHouseTime}
          </div>
          <div className="row">
            <div className="col col-lg-8 activeHomeElement" id="activeHomeStayTitle">
              Estimate View Time
            </div>
            <div className="col col-lg-4 activeHomeElement" id="activeHomeStayValue">
              <select className="form-select form-select-sm" name="stayTime" id="stayTimeSelector" value={this.state.stayTime} onChange={this.handleChangeStayTime}>
                <option value="5">5 mins</option>
                <option value="10">10 mins</option>
                <option value="15">15 mins</option>
                <option value="20">20 mins</option>
                <option value="25">25 mins</option>
                <option value="30">30 mins</option>
              </select>
            </div>
          </div>
          <div className="row activeHomeElement" id="activeHomeAddButton">
            <button type="button" className="btn btn-outline-primary" onClick={this.handleClickAddButton}>Add To List</button>
          </div>
        </div>
      )
    );
  }
}

export default ActiveHome;
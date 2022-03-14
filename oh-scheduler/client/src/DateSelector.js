import './css/DateSelector.css';

import React from "react";

class DateSelector extends React.Component {
  constructor(props) {
    super(props);

    var viewOpenHouseDate = props.viewOpenHouseDate;
    if (viewOpenHouseDate === null) {
      viewOpenHouseDate = "";
    }

    this.state = {
      viewOpenHouseDate: viewOpenHouseDate,
      viewOpenHouseDateOptions: props.viewOpenHouseDateOptions,
    };

    this.setOpenHouseDate = props.setOpenHouseDate;

    this.handleChangeDate = this.handleChangeDate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    var viewOpenHouseDate = nextProps.viewOpenHouseDate;
    if (viewOpenHouseDate === null) {
      viewOpenHouseDate = "";
    }

    this.setState(
      {
        viewOpenHouseDate: nextProps.viewOpenHouseDate,
        viewOpenHouseDateOptions: nextProps.viewOpenHouseDateOptions,
      }
    );
  }

  handleChangeDate(event) {
    this.setOpenHouseDate(event.target.value);
  }

  render() {
    return (
      <div id="dateSelectorContainer">
        <div className="row">
          <div className="col col-lg-8 dateSelectorElement" id="dateSelectorTitle">
            View Open House On
          </div>
          <div className="col col-lg-4 dateSelectorElement" id="dateSelectorValue">
            <select className="form-select form-select-sm" name="viewOpenHouseDate" id="viewDateSelector" value={this.state.viewOpenHouseDate} onChange={this.handleChangeDate}>
              {
                this.state.viewOpenHouseDateOptions && this.state.viewOpenHouseDateOptions.map(option => {
                  return (
                    <option value={option} key={option}>{option}</option>
                  );
                })
              }
            </select>
          </div>
        </div>
      </div>
    );

  }
}

export default DateSelector;
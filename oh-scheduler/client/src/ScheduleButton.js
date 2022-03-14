import './css/ScheduleButton.css';

import React from "react";

class ScheduleButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleSchedule = props.handleSchedule;

    this.handleClickScheduleButton = this.handleClickScheduleButton.bind(this);
  }

  handleClickScheduleButton() {
    this.handleSchedule();
  }

  render() {
    return (
      <div id="scheduleButtonContainer">
        <div className="row scheduleButtonElement" id="scheduleButton">
          <button type="button" className="btn btn-outline-primary" onClick={this.handleClickScheduleButton}>Help Me Schedule</button>
        </div>
      </div>
    );
  }
}

export default ScheduleButton;
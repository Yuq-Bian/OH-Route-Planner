import './css/Marker.css'

import React from "react";

class Marker extends React.Component {

  constructor(props) {
    super(props);
    this.text = props.text;
    this.onclick = props.handleClickMarker;
  }

  render() {
    return (
      <div onClick={this.onclick} className="marker">{this.text}</div>
    );
  }
}

export default Marker;
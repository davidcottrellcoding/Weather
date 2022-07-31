import React from "react";
import "./LocationTitle.css";
interface Props {
  locationName: string;
  locationRegion: string;
}

export class LocationTitle extends React.Component<Props, object> {
  render() {
    return (
      <div className="LocationTitle">
        Weekly Weather For {this.props.locationName},{" "}
        {this.props.locationRegion}
      </div>
    );
  }
}

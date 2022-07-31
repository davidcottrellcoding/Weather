import React from "react";
import "./WeatherBox.css";
import { Forecastday } from "../ThreeDayApiResponse";
import { dayToName } from "../Helpers";

interface Props {
  day: Forecastday;
  openModalWithDay: (day: Forecastday) => void;
}

export class WeatherBox extends React.Component<Props, object> {
  render() {
    const javascriptDate: Date = new Date(this.props.day.date);
    const dayName = dayToName(javascriptDate.getDay());
    const dayIcon = this.props.day.day.condition.icon;
    return (
      <div
        className={"WeatherBox"}
        onClick={() => this.props.openModalWithDay(this.props.day)}
      >
        <div className={"WeatherBoxHeader"}>
          <div>{dayName}</div>
          <div>{javascriptDate.toDateString()}</div>
        </div>
        <div className={"WeatherBoxPicture"}>
          <img src={dayIcon} alt="new" />
        </div>
        <div className={"WeatherBoxFooter"}>
          <div>{this.props.day.day.maxtemp_f} High</div>
          <div>{this.props.day.day.mintemp_f} Low</div>
        </div>
      </div>
    );
  }
}

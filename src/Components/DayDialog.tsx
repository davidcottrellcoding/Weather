import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItemText,
  ListSubheader,
  ListItemButton,
  Collapse,
  ListItemAvatar,
  Avatar,
  Divider,
  Toolbar,
} from "@mui/material";

import * as uuid from "uuid";

import { Forecastday, Hour } from "../ThreeDayApiResponse";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { generateGraphData, GraphData } from "../Helpers";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import "./DayDialog.css";

type MyProps = {
  selectedDay: Forecastday | null;
  dialogOpen: boolean;
  closeDialog: () => void;
};

type MyState = {
  clickedHours: string[];
};

export class DayDialog extends React.Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      clickedHours: [],
    };
  }

  handleDayClick = (hour: Hour) => {
    const clickedHours = this.state.clickedHours;
    const exists = clickedHours.includes(hour.time);
    if (exists) {
      const updatedClickedHours = clickedHours.filter((clickedHourTime) => {
        return clickedHourTime !== hour.time;
      });
      this.setState({ clickedHours: updatedClickedHours });
    } else {
      this.setState({ clickedHours: [...clickedHours, hour.time] });
    }
  };

  renderHourData(hour: Hour[]) {
    return (
      <List
        sx={{ width: "100%" }}
        subheader={<ListSubheader component="div">Hourly Data</ListSubheader>}
      >
        {hour.map((hour) => {
          //Get military time of day
          const timeOfDay = hour.time.trim().split(/\s+/)[1];

          const open = this.state.clickedHours.includes(hour.time);
          return (
            <div>
              <ListItemButton onClick={() => this.handleDayClick(hour)}>
                <ListItemAvatar>
                  <Avatar src={hour.condition.icon} />
                </ListItemAvatar>
                <ListItemText>{timeOfDay}</ListItemText>
                <ListItemText sx={{ width: "10%" }}>
                  {" "}
                  {hour.temp_f} &deg;F{" "}
                </ListItemText>
                <ListItemText sx={{ width: "30%" }}>
                  {hour.condition.text}
                </ListItemText>
                <ListItemText sx={{ width: "30%" }}>
                  Chance of Rain: {hour.chance_of_rain}%
                </ListItemText>
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                {this.renderCollapseDataForHour(hour)}
              </Collapse>
              <Divider />
            </div>
          );
        })}
      </List>
    );
  }

  renderCollapseDataForHour(hour: Hour) {
    return (
      <div className="DialogHourListItemCollapse">
        <div className="DialogHourListItemCollapseRow">
          <div className="DialogHourListItemCollapseColumn">
            <div className="DialogHourListItemCollapseItem">
              <div>Feels Like</div>
              <div>{hour.feelslike_f} &deg;F </div>
            </div>
            <div className="DialogHourListItemCollapseItem">
              <div>UV Index</div>
              <div>{hour.uv}</div>
            </div>
          </div>
          <div className="DialogHourListItemCollapseColumn">
            <div className="DialogHourListItemCollapseItem">
              <div>Wind</div>
              <div>
                {hour.wind_dir} {hour.wind_mph} mph
              </div>
            </div>
            <div className="DialogHourListItemCollapseItem">
              <div>Cloud Cover</div>
              <div>{hour.cloud}%</div>
            </div>
          </div>
          <div className="DialogHourListItemCollapseColumn">
            <div className="DialogHourListItemCollapseItem">
              <div>Humidity</div>
              <div>{hour.humidity}%</div>
            </div>
            <div className="DialogHourListItemCollapseItem">
              <div>Rain Amount</div>
              <div>{hour.precip_in} in</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderDialogGraph(graphData: GraphData[]) {
    return (
      <ResponsiveContainer width={"100%"} height={"100%"}>
        <LineChart data={graphData} margin={{ right: 40 }}>
          <XAxis dataKey={"time"} />
          <YAxis domain={["auto", "auto"]} />
          <Toolbar />
          <Legend />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="temperature" stroke="blue" />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  render() {
    const selectedDay = this.props.selectedDay;
    if (!selectedDay) return;

    const javascriptDate: Date = new Date(selectedDay.date);
    const hourlyValues = selectedDay.hour;
    const graphData = generateGraphData(hourlyValues);
    return (
      <Dialog
        open={this.props.dialogOpen}
        onClose={this.props.closeDialog}
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>
          {javascriptDate.toDateString()}
        </DialogTitle>
        <DialogContent>
          <div className="DialogDailyRateGraphContainer">
            {this.renderDialogGraph(graphData)}
          </div>
          <div className="DialogHourlyRateContainer">
            {this.renderHourData(hourlyValues)}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

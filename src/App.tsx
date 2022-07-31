import React from "react";
import "./App.css";
import { WeatherBox } from "./Components/WeatherBox";
import { LocationTitle } from "./Components/LocationTitle";
import { Forecastday, Hour } from "./ThreeDayApiResponse";
import { LocationSearchBar } from "./Components/LocationSearchBar";
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
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { dayToName, generateGraphData, GraphData } from "./Helpers";
type myState = {
  forecast: Forecastday[];
  locationName: string;
  locationRegion: string;
  modalOpen: boolean;
  selectedDay: Forecastday | null;
  clickedHours: string[];
};

class App extends React.Component<{}, myState> {
  constructor(props: any) {
    super(props);
    this.state = {
      forecast: [],
      locationName: "Miami",
      locationRegion: "Florida",
      modalOpen: false,
      selectedDay: null,
      clickedHours: [],
    };
    this.getCurrentLocationWeather.bind(this);
    this.getCurrentLocationWeather();
  }

  getCurrentLocationWeather() {
    let key = "6190197555024f20976223208221907";
    let url =
      "http://api.weatherapi.com/v1/forecast.json?key=" +
      key +
      "&q=" +
      this.state.locationName +
      "&days=3";
    fetch(url)
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        let dayArray: Forecastday[] = [];
        data.forecast.forecastday.forEach((fullDayInfo: Forecastday) => {
          dayArray.push(fullDayInfo);
        });
        this.setState({ forecast: dayArray });
        this.setState({ locationName: data.location.name });
        this.setState({ locationRegion: data.location.region });
      });
  }

  componentDidUpdate(prevProps: any, prevState: myState) {
    if (prevState.locationName !== this.state.locationName) {
      this.getCurrentLocationWeather();
    }
  }

  openModal = (day: Forecastday) => {
    this.setState({ modalOpen: true });
    this.setState({ selectedDay: day });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
    this.setState({ clickedHours: [] });
  };

  handleDayClick = (hour: Hour) => {
    const clickedHours = this.state.clickedHours;
    console.log(clickedHours);
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

  renderCollapseDataForHour(hour: Hour) {
    return (
      <div className="DialogHourListItemCollapse">
        <div className="DialogHourListItemCollapseRow">
          <div className="DialogHourListItemCollapseColumn">
            <div className="DialogHourListItemCollapseItem">
              <div>Feels Like</div>
              <div>{hour.feelslike_f}</div>
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
              <div>{hour.cloud}</div>
            </div>
          </div>
          <div className="DialogHourListItemCollapseColumn">
            <div className="DialogHourListItemCollapseItem">
              <div>Humidity</div>
              <div>{hour.humidity}</div>
            </div>
            <div className="DialogHourListItemCollapseItem">
              <div>Rain Amount</div>
              <div>{hour.precip_in}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <ListItemText> {hour.temp_f} &deg;F </ListItemText>
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

  renderWeatherBox(day: Forecastday) {
    return <WeatherBox day={day} openModalWithDay={this.openModal} />;
  }

  renderDialogGraph(graphData: GraphData[]) {
    return (
      <ResponsiveContainer width={"100%"} height={"100%"}>
        <LineChart data={graphData} margin={{ right: 40 }}>
          <XAxis dataKey={"time"} />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="temperature" stroke="blue" />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  renderDialog() {
    const selectedDay = this.state.selectedDay;
    if (!selectedDay) return;
    const javascriptDate: Date = new Date(selectedDay.date);
    const hourlyValues = selectedDay.hour;
    const graphData = generateGraphData(hourlyValues);
    return (
      <Dialog
        open={this.state.modalOpen}
        onClose={this.closeModal}
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

  render() {
    const callback = (name: string) => {
      this.setState({ locationName: name });
    };

    return (
      <div className="App">
        <div className="FullLocationContainer">
          <LocationSearchBar setLocationHandler={callback} />
          <div className="LocationHeaderContainer">
            <div className="LocationHeader">
              <LocationTitle
                locationName={this.state.locationName}
                locationRegion={this.state.locationRegion}
              />
            </div>
          </div>
          <div className={"WeatherBoxMainPanel"}>
            <div className="WeatherBoxContainer">
              {this.state.forecast.map((day) => {
                return this.renderWeatherBox(day);
              })}
            </div>
          </div>
        </div>
        {this.renderDialog()}
      </div>
    );
  }
}

export default App;

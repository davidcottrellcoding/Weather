import React from "react";
import "./App.css";
import { WeatherBox } from "./Components/WeatherBox";
import { LocationTitle } from "./Components/LocationTitle";
import { Forecastday } from "./ThreeDayApiResponse";
import { LocationSearchBar } from "./Components/LocationSearchBar";
import { DayDialog } from "./Components/DayDialog";

type myState = {
  forecast: Forecastday[];
  locationName: string;
  locationRegion: string;
  dialogOpen: boolean;
  selectedDay: Forecastday | null;
};

class App extends React.Component<{}, myState> {
  constructor(props: any) {
    super(props);
    this.state = {
      forecast: [],
      locationName: "Miami",
      locationRegion: "Florida",
      dialogOpen: false,
      selectedDay: null,
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
    this.setState({ dialogOpen: true });
    this.setState({ selectedDay: day });
  };

  closeModal = () => {
    this.setState({ dialogOpen: false });
  };

  setLocationHeader = (name: string) => {
    this.setState({ locationName: name });
  };

  renderWeatherBox(day: Forecastday) {
    return <WeatherBox day={day} openModalWithDay={this.openModal} />;
  }

  render() {
    return (
      <div className="App">
        <div className="FullLocationContainer">
          <LocationSearchBar setLocationHandler={this.setLocationHeader} />
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
        {
          <DayDialog
            selectedDay={this.state.selectedDay}
            dialogOpen={this.state.dialogOpen}
            closeModal={this.closeModal}
          />
        }
      </div>
    );
  }
}

export default App;

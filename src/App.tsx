import React from 'react';
import './App.css';
import { WeatherBox } from './Components/WeatherBox';
import { LocationTitle } from './Components/LocationTitle';
import { Weather } from './Components/WeatherBox';
import moment from 'moment';
type myState = {fiveDayWeather: any}

class App extends React.Component<{}, myState> {

  constructor(props:any) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.loadData();
    this.state = {
      fiveDayWeather: null
    }
  }

  loadData() {
    let key = '70129c15451a86bd4c61c22b30a8e7b5';
    let threeHourWeather:any[] = [];
    let fiveDayWeather:any[][] = [[], [], [], [], [], [], []];
    fetch('https://api.openweathermap.org/data/2.5/forecast?id=4299276&appid=' + key)  
    .then((resp) => { return resp.json() })
    .then((data) => {
      data.list.forEach((thirdHour:any) => {
        threeHourWeather.push(thirdHour);
      });
      return threeHourWeather
    }).then(threeHourWeather => {
      threeHourWeather.forEach((thirdHour) => {
        let date = moment(thirdHour.dt_txt.split(/[ ,]+/)[0]);
        let dow = date.day();
        fiveDayWeather[dow].push(thirdHour);
      })
      this.setState({fiveDayWeather});
    });
  }
  
  renderWeatherBox(day: string, date: string, highTemp: number, lowTemp: number, weather: Weather) {
    return <WeatherBox
      day={day}
      date={date}
      highTemp={highTemp}
      lowTemp={lowTemp}
      weather={weather}
    />
      
  }


  render() {
    if(this.state.fiveDayWeather === null) {
      return <div></div>
    }
    return (
      <div className="App">
        <header className="App-header">
          <LocationTitle/>
          <div className="WeatherBoxContainer">
            {this.state.fiveDayWeather.map((day:[], index:number) => {
              if(day.length > 0) {
                return this.renderWeatherBox(numberToDow(index), getDate(day), findHighTemp(day), findLowTemp(day), Weather.Sunny);
              }
              return null
            })}
          </div>
        </header>
      </div>
    );
  }
}

function getDate(day: any) {
  return day[0].dt_txt.split(/[ ,]+/)[0];
}

function findHighTemp(day: any) {
  let dayHigh = 0;
  day.forEach((thirdHour: any) => {
    if(thirdHour.main.temp > dayHigh) {
      dayHigh = thirdHour.main.temp;
    }
  })
  return kelvinToFahrenheit(dayHigh);
}

function findLowTemp(day: any) {
  let dayLow = Infinity;
  day.forEach((thirdHour: any) => {
    if(thirdHour.main.temp < dayLow) {
      dayLow = thirdHour.main.temp;
    }
  })
  return kelvinToFahrenheit(dayLow);
}

function kelvinToFahrenheit(kelvin: number) {
  return (kelvin - 273.15) * (9/5) + 32;
}

function determineWeather() {
  
}

export function numberToDow(dayNumber: number) {
  switch(dayNumber) {
      case 0: {
          return 'Sunday';
      }
      case 1: {
          return 'Monday';
      }
      case 2: {
          return 'Tuesday';
      }
      case 3: {
          return 'Wednesday';
      }
      case 4: {
          return 'Thursday';
      }
      case 5: {
          return 'Friday';
      }
      case 6: {
          return 'Saturday';
      }
      default: {
        return 'This shouldnt happen';
      }
  }
}

export default App;

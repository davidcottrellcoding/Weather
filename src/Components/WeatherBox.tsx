import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import "./WeatherBox.css";
import { ReactComponent as Thunderstorm } from '../Images/storm.svg'
import { ReactComponent as Cloudy } from '../Images/cloud.svg'
import { ReactComponent as Raining } from '../Images/rainy.svg'
import { ReactComponent as Snowy } from '../Images/snowy.svg'
import { ReactComponent as Sunny } from '../Images/sun.svg'
import { numberToDow } from '../App';

interface Props {
    day: string;
    date: string;
    highTemp: number;
    lowTemp: number;
    weather: Weather;
}

export enum Weather {
    Raining = 1,
    Sunny,
    Snowing,
    Cloudy,
    Thunderstorm,
}

export class WeatherBox extends React.Component<Props, object> {

    displayWeather() {
        switch(this.props.weather) {
            case Weather.Raining: {
                return <Raining />;
            }
            case Weather.Sunny: {
                return <Sunny />;
            }
            case Weather.Snowing: {
                return <Snowy />;
            }
            case Weather.Cloudy: {
                return <Cloudy />;
            }
            case Weather.Thunderstorm: {
                return <Thunderstorm />;
            }
        }
    }

    render () {
        let nextTwoDays = numberToDow(moment().day()+1) === this.props.day ||
                          numberToDow(moment().day()) === this.props.day;
        let isTodayClassName = classNames('weatherBox', {'todaysWeatherBox': nextTwoDays, });
        return (
            <div className={isTodayClassName}>
                <div>{this.props.day}</div>
                <div>{this.props.date}</div>
                {this.displayWeather()}
                <div>{this.props.highTemp.toFixed(1)} High</div>
                <div>{this.props.lowTemp.toFixed(1)} Low</div>
            </div>
        );
    }
}

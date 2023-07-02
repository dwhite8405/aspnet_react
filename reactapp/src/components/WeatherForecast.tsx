import { Component } from "react";

interface TemperatureMeasurement {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

interface WeatherForecastProps {
}

interface WeatherForecastState {
    forecasts: Array<TemperatureMeasurement>;
    loading: boolean;
    error: string | null;
}

export class WeatherForecast extends Component<WeatherForecastProps, WeatherForecastState> {
    constructor(props: Readonly<WeatherForecastProps>) {
        super(props);
        this.state = { forecasts: [], loading: true, error: null };
    }

    componentDidMount() {
        this.populateWeatherData();
    }

    render() {
        if (this.state.loading) {
            return <p>Loading...</p>
        }

        if (this.state.error) {
            return <div>{this.state.error}</div>
        }

        let forecasts = this.state.forecasts;
        return (
            <div>
                <h1>Weather forecast</h1>
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Temp. (C)</th>
                            <th>Temp. (F)</th>
                            <th>Summary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forecasts.map(forecast =>
                            <tr key={forecast.date}>
                                <td>{forecast.date}</td>
                                <td>{forecast.temperatureC}</td>
                                <td>{forecast.temperatureF}</td>
                                <td>{forecast.summary}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    async populateWeatherData() {
        const response = await fetch('/api/WeatherForecast');
        if (response?.ok) {
            const data = await response.json();
            this.setState({ forecasts: data, loading: false, error: null });
            return;
        }

        if (!response) {
            this.setState({ loading: false, error: "Response was invalid." });
        } else {
            if (response.status === 401) {
                this.setState({ loading: false, error: "Not logged in. We're not going to redirect you so you need to log in and come back here." })
            } else {
                this.setState({ loading: false, error: `${response.status} ${response.statusText}` });
            }
        }
    }
}
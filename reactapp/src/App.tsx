import { Component } from 'react';
import './App.css';

interface TemperatureMeasurement {
  date: string;
  temperatureC : number;
  temperatureF : number;
  summary: string;
}

interface AppProps { }

interface AppState {
  forecasts : Array<TemperatureMeasurement>;
  loading: boolean;
  error: string|null;
} 

export default class App extends Component<AppProps, AppState> {
  static displayName = App.name;

  constructor(props: Readonly<AppProps>) {
      super(props);
      this.state = { forecasts: [], loading: true, error:null };
  }

  componentDidMount() {
      this.populateWeatherData();
  }

  static renderForecastsTable(forecasts: Array<TemperatureMeasurement>) {
      return (
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
      );
  }

  render() {
      let contents = this.state.loading
          ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
          : App.renderForecastsTable(this.state.forecasts);

      return (
          <div>
              <h1 id="tabelLabel" >Weather forecast</h1>
              <p><a href="/login">Login</a></p>
              <p><a href="/logout">Logout</a></p>
              <p><a href="https://localhost:7170/swagger">OpenAPI definitions</a></p>
              <p><a href="https://myaccount.microsoft.com/">https://myaccount.microsoft.com/</a></p>
              <p>This component demonstrates fetching data from the server.</p>
              {contents}
              {this.state.error}
          </div>
      );
  }

  async populateWeatherData() {
      const response = await fetch('weatherforecast');
      if (response?.ok) {
          const data = await response.json();
          this.setState({ forecasts: data, loading: false });
      } else {
          this.setState({
              loading: false,
              error: "Try logging in."
          });
      }
  }
}

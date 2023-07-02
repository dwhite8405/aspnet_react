import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Routes, useRouteError } from 'react-router-dom';
import './App.css';
import { FrontPage } from './components/FrontPage';
import { Open } from './components/Open';
import { Protected } from './components/Protected';
import { WeatherForecast } from './components/WeatherForecast';


interface AppProps { }

interface AppState {
}

export default class App extends Component<AppProps, AppState> {
    static displayName = App.name;


    render() {

        return (
            <React.StrictMode>
                <BrowserRouter>
                    <div>
                        <Link to="/">Front Page</Link>&nbsp;
                        <Link to="/WeatherForecast">Weather Forecast</Link>&nbsp;
                        <Link to="/open">Open page</Link>&nbsp;
                        <Link to="/protected">Protected page</Link>&nbsp;
                        {/* The login and logout links always need to go to the back-end. */}
                        <a href="/login">Login</a>&nbsp;
                        <a href="/logout">Logout</a>
                    </div>
                    <div>
                        <Routes >
                            <Route path="/" element={<FrontPage />} errorElement={<ErrorHandler />} />
                            <Route path="/WeatherForecast" element={<WeatherForecast />} />
                            <Route path="/open" element={<Open />} />
                            <Route path="/protected" element={<Protected />} />
                            <Route path="*" element={<PageNotFound/> } />
                        </Routes>
                    </div>
                </BrowserRouter>
             </React.StrictMode>
        );
    }
}

function ErrorHandler() {
    let error = useRouteError();
    console.error(error);
    return <div>Error occurred. </div>;
}

function PageNotFound() {
    return (
        <div>
            <h1>Page not found</h1>
        </div>
    );
}
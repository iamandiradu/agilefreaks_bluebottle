import React from 'react';
import { BubbleMap } from '../';
import logo from '../../images/logo.png';
import './app.css';

function App() {
    const dummyData = [
        {
            label: 'Moscow',
            latitude: 55.752,
            longitude: 37.595,
            color: '#009ED9',
            customTooltip: '1450.31 km',
            value: 1,
        },
        {
            label: 'Seattle2',
            latitude: 47.587,
            longitude: -122.337,
            color: '#009ED9',
            customTooltip: '9132.53 km',
            value: 1,
        },
        {
            label: 'Seattle',
            latitude: 47.581,
            longitude: -122.316,
            color: '#009ED9',
            customTooltip: '9132.54 km',
            value: 1,
        },
        {
            label: 'User',
            latitude: 45.786716899999995,
            longitude: 24.1774323,
            color: 'red',
            value: 1,
        },
    ];
    return (
        <div className="app">
            <header className="header">
                <div>
                    <span>Coffee Shop Finder Map </span>
                </div>
                <img src={logo} className="logo" alt="logo" />
            </header>
            <div className="main">
                <BubbleMap data={dummyData} />
            </div>
        </div>
    );
}

export default App;

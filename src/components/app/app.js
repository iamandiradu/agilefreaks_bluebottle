import React, { useState, useEffect } from 'react';
import { BubbleMap } from '../';
import { getUserDistance, getUserCoordinates } from '../../utils/';
import api from '../../api/api.js';
import logo from '../../images/logo.png';
import './app.css';

const coffeeShopsShown = 3;
const coffeeShopNameDelimiter = 'Blue Bottle ';
function App() {
    const [apiToken, setApiToken] = useState('');
    const [apiData, setApiData] = useState([]);
    const [userCoordinates, setUserCoordinates] = useState({});
    const [processedApiData, setProcessedApiData] = useState([]);

    // Get API Data & User coordinates
    useEffect(() => {
        getUserCoordinates()
            .then((position) => {
                setUserCoordinates({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            })
            .catch((error) => {
                console.error(error.message);
            });
        api.getToken()
            .then((token) => {
                setApiToken(token);
                api.getData(token).then((data) => {
                    setApiData(data);
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // Process API Data & User coordinates
    useEffect(() => {
        if (apiData && userCoordinates.latitude && userCoordinates.longitude) {
            let coffeeShopsData = [];

            if (apiData.length > 0) {
                apiData.forEach((coffeeShop) => {
                    coffeeShop.distance = getUserDistance(
                        userCoordinates,
                        coffeeShop.x,
                        coffeeShop.y
                    );
                });
                apiData.sort((a, b) => (a.distance > b.distance ? 1 : -1));
                apiData.forEach((coffeeShop, index) => {
                    index < coffeeShopsShown &&
                        coffeeShopsData.push({
                            label: coffeeShopNameDelimiter
                                ? coffeeShop.name.split(coffeeShopNameDelimiter).pop()
                                : coffeeShop.name,
                            latitude: parseFloat(coffeeShop.x),
                            longitude: parseFloat(coffeeShop.y),
                            color: '#009ED9',
                            customTooltip: `${getUserDistance(
                                userCoordinates,
                                coffeeShop.x,
                                coffeeShop.y
                            )} km`,
                            value: 1,
                        });
                });
                coffeeShopsData.push({
                    label: 'User',
                    latitude: userCoordinates.latitude,
                    longitude: userCoordinates.longitude,
                    color: 'red',
                    value: 1,
                });
                console.log(coffeeShopsData);
            }
            setProcessedApiData(coffeeShopsData);
        }
    }, [apiData, userCoordinates, userCoordinates.latitude, userCoordinates.longitude]);

    return (
        <div className="app">
            <header className="header">
                <div>
                    <span>Coffee Shop Finder Map </span>
                </div>
                <img src={logo} className="logo" alt="logo" />
            </header>
            <div className="main">
                <BubbleMap data={processedApiData} />
            </div>
        </div>
    );
}

export default App;

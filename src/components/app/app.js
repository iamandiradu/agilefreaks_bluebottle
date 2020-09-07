import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import { BubbleMap, WorldMap } from '../';
import { getUserDistance, getUserCoordinates } from '../../utils/';
import api from '../../api/api.js';
import logo from '../../images/logo.png';
import spinner from '../../images/spinner.svg';
import './app.css';

const coffeeShopsShownOnBubbleMap = 3;
const coffeeShopsShownOnWorldMap = 6;
const coffeeShopNameDelimiter = 'Blue Bottle ';

function App() {
    const [apiToken, setApiToken] = useState('');
    const [apiData, setApiData] = useState([]);
    const [userCoordinates, setUserCoordinates] = useState({});
    const [processedApiData, setProcessedApiData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMapToggled, setIsMapToggled] = useState(false);

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
                    index <
                        (isMapToggled ? coffeeShopsShownOnWorldMap : coffeeShopsShownOnBubbleMap) &&
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
            }
            setProcessedApiData(coffeeShopsData);
        }
    }, [
        apiData,
        isMapToggled,
        userCoordinates,
        userCoordinates.latitude,
        userCoordinates.longitude,
    ]);

    // Set isLoading to false if all data is loaded
    useEffect(() => {
        if (apiToken && apiData && userCoordinates.latitude && userCoordinates.longitude) {
            setIsLoading(false);
        }
    }, [apiData, apiToken, userCoordinates.latitude, userCoordinates.longitude]);

    const handleMapToggle = (checked) => {
        setIsMapToggled(checked);
    };

    return isLoading ? (
        <div className="spinnerWrapper">
            <img src={spinner} className="spinner" alt="spinner" />
        </div>
    ) : (
        <div className="app">
            <header className="header">
                <img src={logo} className="logo" alt="logo" />
                <div>
                    <span>Coffee Shop Finder Map </span>
                    <Switch onChange={handleMapToggle} checked={isMapToggled} />
                </div>
            </header>
            <div className="main">
                {isMapToggled ? (
                    <WorldMap data={processedApiData} />
                ) : (
                    <BubbleMap data={processedApiData} />
                )}
            </div>
        </div>
    );
}

export default App;

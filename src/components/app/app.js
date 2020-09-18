import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import { XYChart, WorldMap } from '../';
import { getUserDistance, useDebounce } from '../../utils/';
import api from '../../api/api.js';
import logo from '../../images/logo.png';
import spinner from '../../images/spinner.svg';
import './app.css';

const coffeeShopsShownOnMap = 3;
const coffeeShopNameSplitter = 'Blue Bottle ';

function App() {
    const [apiToken, setApiToken] = useState('');
    const [apiData, setApiData] = useState([]);
    const [apiError, setApiError] = useState('');
    const [userCoordinates, setUserCoordinates] = useState({
        latitude: '',
        longitude: '',
    });
    const [userCoordinatesForm, setUserCoordinatesForm] = useState({
        latitude: '',
        longitude: '',
    });
    const [processedApiData, setProcessedApiData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMapToggled, setIsMapToggled] = useState(false);
    const [shouldRenderMap, setShouldRenderMap] = useState(false);

    const debouncedUserLatitude = useDebounce(userCoordinatesForm.latitude, 500);
    const debouncedUserLongitude = useDebounce(userCoordinatesForm.longitude, 500);

    const handleMapToggle = (checked) => {
        setIsMapToggled(checked);
    };

    // Get API Data
    useEffect(() => {
        async function fetchResources() {
            try {
                const token = await api.getToken();
                const data = await api.getData(token);
                setApiData(data);
                setApiToken(token);
            } catch (error) {
                console.error(error.message);
                setApiError(error.message);
            }
        }
        fetchResources();
    }, []);

    // Process API Data & User coordinates
    useEffect(() => {
        if (apiData && userCoordinates.latitude && userCoordinates.longitude) {
            let coffeeShopsData = [];

            if (apiData.length > 0) {
                const userData = {
                    label: 'User',
                    latitude: parseFloat(userCoordinates.latitude),
                    longitude: parseFloat(userCoordinates.longitude),
                    color: '#ff0000',
                    value: 1,
                };

                // Generate the coffee shops data (sort, slice, distance, tooltip)
                coffeeShopsData = apiData
                    .reduce((acc, coffeeShop) => {
                        //  Create tooltip. ex: 12345.6 km
                        const tooltip = `${getUserDistance(
                            userCoordinates,
                            coffeeShop.x,
                            coffeeShop.y
                        )} km`;

                        // If a splitter text is present, remove that text from the coffee shop's name.
                        const label = coffeeShopNameSplitter
                            ? coffeeShop.name.split(coffeeShopNameSplitter).pop()
                            : coffeeShop.name;

                        const coffeeShopData = {
                            label,
                            customTooltip: tooltip,
                            latitude: parseFloat(coffeeShop.x),
                            longitude: parseFloat(coffeeShop.y),
                            distance: getUserDistance(userCoordinates, coffeeShop.x, coffeeShop.y),
                            color: '#009ED9',
                            value: 1, // This value is required by the AmCharts package to calculate the elements radius ratio.
                        };

                        acc.push(coffeeShopData);
                        return acc;
                    }, [])
                    .sort((a, b) => (a.distance > b.distance ? 1 : -1))
                    .slice(0, coffeeShopsShownOnMap);

                // Push user data into data array
                coffeeShopsData.push(userData);
            }
            setProcessedApiData(coffeeShopsData);
        }
    }, [apiData, userCoordinates, userCoordinates.latitude, userCoordinates.longitude]);

    // Set isLoading to false if all data is loaded
    useEffect(() => {
        if ((apiToken && apiData) || apiError) {
            setIsLoading(false);
        }
    }, [apiData, apiError, apiToken]);

    // Handle map rendering
    useEffect(() => {
        if (apiData && !isLoading) {
            if (apiData && userCoordinates.longitude && userCoordinates.latitude && !isLoading) {
                setShouldRenderMap(true);
            }
        }
    }, [apiData, userCoordinates.latitude, isLoading, userCoordinates.longitude]);

    // Debounce user coordinates form
    useEffect(() => {
        if (debouncedUserLatitude) {
            setUserCoordinates((prevState) => ({
                ...prevState,
                latitude: debouncedUserLatitude,
            }));
        }
        if (debouncedUserLongitude) {
            setUserCoordinates((prevState) => ({
                ...prevState,
                longitude: debouncedUserLongitude,
            }));
        }
    }, [debouncedUserLatitude, debouncedUserLongitude]);

    return isLoading ? (
        <div className="spinnerWrapper">
            <img src={spinner} className="spinner" alt="spinner" />
        </div>
    ) : apiError ? (
        <div className="app">
            <p>The server connection could not be established. Please try again later.</p>
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
            <form>
                <label className="formLabel">
                    Latitude:
                    <input
                        type="number"
                        name="latitude"
                        onChange={(e) => setUserCoordinatesForm({ latitude: e.target.value })}
                    />
                </label>
                <label className="formLabel">
                    Longitude:
                    <input
                        type="number"
                        name="longitude"
                        onChange={(e) => setUserCoordinatesForm({ longitude: e.target.value })}
                    />
                </label>
            </form>
            {shouldRenderMap ? (
                <div className="main">
                    {isMapToggled ? (
                        <WorldMap data={processedApiData} />
                    ) : (
                        <XYChart data={processedApiData} />
                    )}
                </div>
            ) : (
                <p>The map will render after you complete the coordinates.</p>
            )}
        </div>
    );
}

export default App;

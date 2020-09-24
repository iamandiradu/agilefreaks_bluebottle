import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import { XYChart, WorldMap } from '../';
import { useDebounce, processMapData } from '../../utils/';
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
                setIsApiError(true);
            }
        }
        fetchResources();
    }, []);

    // Process API Data & User coordinates
    useEffect(() => {
        if (apiData && userCoordinates.latitude && userCoordinates.longitude) {
            let coffeeShopsData = processMapData(
                apiData,
                userCoordinates,
                coffeeShopsShownOnMap,
                coffeeShopNameSplitter
            );

            setProcessedApiData(coffeeShopsData);
        }
    }, [apiData, userCoordinates]);

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

    const renderSpinner = () => {
        return (
            isLoading && (
                <div className="spinnerWrapper">
                    <img src={spinner} className="spinner" alt="spinner" />
                </div>
            )
        );
    };

    const renderErrorScreen = () => {
        return (
            apiError && (
                <div className="errorScreen">
                    <p>The server connection could not be established. Please try again.</p>
                </div>
            )
        );
    };
    const renderHeader = () => {
        const renderCondition = !apiError && !isLoading;
        return (
            renderCondition && (
                <header className="header">
                    <img src={logo} className="logo" alt="logo" />
                    <div>
                        <span>Coffee Shop Finder Map </span>
                        <Switch
                            onChange={handleMapToggle}
                            checked={isMapToggled}
                            className="mapToggle"
                            id={`switchState-${isMapToggled}`}
                        />
                    </div>
                </header>
            )
        );
    };

    const renderCoordinatesForm = () => {
        const renderCondition = !apiError && !isLoading;
        return (
            renderCondition && (
                <div className="formWrapper">
                    <form>
                        <label className="formLabel latitudeLabel">
                            Latitude:
                            <input
                                type="number"
                                name="latitude"
                                value={userCoordinatesForm.latitude}
                                onChange={(e) =>
                                    setUserCoordinatesForm({
                                        latitude: e.target.value,
                                        longitude: userCoordinatesForm.longitude,
                                    })
                                }
                            />
                        </label>
                        <label className="formLabel longitudeLabel">
                            Longitude:
                            <input
                                type="number"
                                name="longitude"
                                value={userCoordinatesForm.longitude}
                                onChange={(e) =>
                                    setUserCoordinatesForm({
                                        longitude: e.target.value,
                                        latitude: userCoordinatesForm.latitude,
                                    })
                                }
                            />
                        </label>
                    </form>
                    {!shouldRenderMap && (
                        <p className="coordinatesDisclaimer">
                            The map will render after you complete the coordinates.
                        </p>
                    )}
                </div>
            )
        );
    };

    const renderMapOrGraph = () => {
        const MainComponent = isMapToggled ? WorldMap : XYChart;
        return (
            shouldRenderMap && (
                <div className="main">
                    <MainComponent data={processedApiData} />
                </div>
            )
        );
    };

    return (
        <div className="app">
            {renderSpinner()}
            {renderErrorScreen()}
            {renderHeader()}
            {renderCoordinatesForm()}
            {renderMapOrGraph()}
        </div>
    );
}

export default App;

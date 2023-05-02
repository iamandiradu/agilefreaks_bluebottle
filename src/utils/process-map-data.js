import { getUserDistance } from './';

export function processMapData(
    apiData,
    userCoordinates,
    coffeeShopsShownOnMap,
    coffeeShopNameSplitter = false
) {
    if (apiData.length > 0) {
        const userData = {
            label: 'User',
            latitude: parseFloat(userCoordinates.latitude),
            longitude: parseFloat(userCoordinates.longitude),
            color: '#ff0000',
            value: 1, // This value is required by the AmCharts package to calculate the elements radius ratio.
        };

        // Generate the coffee shops data (sort, slice, distance, tooltip)
        let coffeeShopsData = apiData
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

        return coffeeShopsData;
    }
}

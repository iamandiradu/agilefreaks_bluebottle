/* Haversine formula */

function toRad(coordinate) {
    return (coordinate * Math.PI) / 180;
}

export function getUserDistance(userCoordinates, latitude, longitude) {
    if (userCoordinates.latitude) {
        const earthRadius = 6371;
        const latitudeDifference = latitude - userCoordinates.latitude;
        const longitudeDifference = longitude - userCoordinates.longitude;
        const latitudeDifferenceInRadians = toRad(latitudeDifference);
        const longitudeDifferenceInRadians = toRad(longitudeDifference);
        const userLatitudeInRadians = toRad(userCoordinates.latitude);
        const latitudeInRadians = toRad(latitude);

        const a =
            Math.sin(latitudeDifferenceInRadians / 2) * Math.sin(latitudeDifferenceInRadians / 2) +
            Math.cos(userLatitudeInRadians) *
                Math.cos(latitudeInRadians) *
                Math.sin(longitudeDifferenceInRadians / 2) *
                Math.sin(longitudeDifferenceInRadians / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = earthRadius * c;
        return Math.round(d * 100) / 100;
    } else {
        return false;
    }
}

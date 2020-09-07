export function getUserDistance(userCoordinates, latitude, longitude) {
    if (userCoordinates.latitude) {
        var p = 0.017453292519943295; // Math.PI / 180
        var c = Math.cos;
        var a =
            0.5 -
            c((latitude - userCoordinates.latitude) * p) / 2 +
            (c(userCoordinates.latitude * p) *
                c(latitude * p) *
                (1 - c((longitude - userCoordinates.longitude) * p))) /
                2;
        return Math.round((12742 * Math.asin(Math.sqrt(a)) + Number.EPSILON) * 100) / 100; // 2 * R; R = 6371 km
    } else {
        return false;
    }
}

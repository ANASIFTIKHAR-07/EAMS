export const getDsitanceFromLatLng = (lat1, lng1, lat2, lng2)=> {
    const toRad = (value)=> (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth

    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)


    const a =  
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * 
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // in meters
}
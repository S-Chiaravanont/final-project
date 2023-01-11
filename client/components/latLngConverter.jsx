export default function latLngConversion(latLng, radius) {
  const radiusInput = Number(radius);
  const { lat, lng } = latLng;
  const radiansToDegrees = 180 / Math.PI;
  const degreesToRadians = Math.PI / 180;
  const earthRadius = 3960.0;
  const changeInLat = (radiusInput / earthRadius) * radiansToDegrees;
  const changeInLng = (radiusInput / (earthRadius * Math.cos(Number(lat) * degreesToRadians))) * radiansToDegrees;
  const upperLimit = Number(lat) + changeInLat;
  const lowerLimit = Number(lat) - changeInLat;
  const leftLimit = Number(lng) - changeInLng;
  const rightLimit = Number(lng) + changeInLng;
  const latLngLimit = { upperLimit, lowerLimit, leftLimit, rightLimit };
  return latLngLimit;
}

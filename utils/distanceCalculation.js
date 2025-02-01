import haversineDistance from "./haversine";
import calculateETA from "./etaCalculation";

export default function getDistanceAndETA(lat1, lng1, lat2, lng2, speed = 40) {
  const distance = haversineDistance(lat1, lng1, lat2, lng2);
  const eta = calculateETA(distance, speed);

  return {
    distance: distance.toFixed(2), // Distance in kilometers
    eta, // ETA in minutes
  };
}

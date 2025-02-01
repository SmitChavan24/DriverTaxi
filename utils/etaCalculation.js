export default function calculateETA(distance, averageSpeed = 40) {
  const timeInHours = distance / averageSpeed; // Calculate time in hours
  return Math.round(timeInHours * 60); // Return ETA in minutes
}

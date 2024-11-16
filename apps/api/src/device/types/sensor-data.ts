export type SensorData = {
  type: 'Temperature' | 'Humidity' | 'Rainfall' | 'Wind' | "SoilMoisture";
  time: number;
  data: number;
};
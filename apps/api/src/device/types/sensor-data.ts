export type SensorData = {
  type: 'Temperature' | 'Humidity' | 'Pressure' | 'Wind';
  time: number;
  data: number;
};
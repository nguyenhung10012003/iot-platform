export type Location = {
  name: string;
  address: string;
  capacity: number;
  area: number;
  disPerRow: number;
  disPerHole: number;
  fertilizerLevel: number;
  totalHole: number;
  dripRatePerHole: number;
  wateringMode: boolean;
  image: File;
};

export interface AreaModel {
  id: string;
  name: string;
  locationId: string;
}

export type LocationModel = {
  id: string;
  name: string;
  address: string;
  image: string;
  areas?: AreaModel[];
  setting: {
    capacity: number;
    area: number;
    disPerRow: number;
    disPerHole: number;
    fertilizerLevel: number;
    totalHole: number;
    dripRatePerHole: number;
    wateringMode: boolean;
  };
};

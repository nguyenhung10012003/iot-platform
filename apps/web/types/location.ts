export type Location = {
  name: string;
  address: string;
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
};

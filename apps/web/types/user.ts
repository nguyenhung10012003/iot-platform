import { Role } from "./role";

export type User = {
  id: string;
  username: string;
  role: Role;
  avatar: string;
  name?: string;
};

export type UserLocation = {
  location: Location,
  user: User,
  role: UserLocationRole,
}

type UserLocationRole = "EMPLOYEE" | "EMPLOYER";
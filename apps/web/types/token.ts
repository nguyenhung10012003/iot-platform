import { Role } from './role';

export type Token = {
  token: string;
  refreshToken: string;
  type: string;
  userId: string;
  role: Role;
  issuedAt: Date;
  expireAt: Date;
};

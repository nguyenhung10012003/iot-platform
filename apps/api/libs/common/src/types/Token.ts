export class Token {
  userId: string;
  token: string;
  type: string;
  role: string;
  refreshToken: string;
  issuedAt: Date;
  expireAt: Date;
}

export type TokenPayload = {
  sub: string;
  username: string;
  role: string;
};

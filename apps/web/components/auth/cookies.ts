import { setCookie } from "cookies-next";
import { Token } from "../../types/token";

export const setTokenCookies = (token: Token) => {
  setCookie("userId", token.userId);
  setCookie("token", token.token);
  setCookie("refreshToken", token.refreshToken);
  setCookie("role", token.role);
};
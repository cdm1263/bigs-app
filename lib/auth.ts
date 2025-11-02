import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/app/api/types";

export const getUserFromToken = (
  token: string | undefined
): JwtPayload | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
};

export const getTokenFromCookie = (): string | undefined => {
  if (typeof document === "undefined") return undefined;

  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((c) => c.trim().startsWith("access-token="));

  if (!tokenCookie) return undefined;

  return tokenCookie.split("=")[1];
};

export const getCurrentUser = (): JwtPayload | null => {
  const token = getTokenFromCookie();
  return getUserFromToken(token);
};

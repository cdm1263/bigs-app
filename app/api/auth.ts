import { apiClient } from "./client";
import type {
  SignInRequest,
  SignupRequest,
  AuthResponse,
  RefreshTokenResponse,
} from "./types";

// 회원가입
export const signUp = async (data: SignupRequest): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/signup", data);

  return response.data;
};

// 로그인
export const signIn = async (data: SignInRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/signin", data);

  return response.data;
};

export const refreshToken = async (
  refreshTokenValue: string
): Promise<RefreshTokenResponse> => {
  try {
    const response = await apiClient.post<RefreshTokenResponse>(
      "/auth/refresh",
      {
        refreshToken: refreshTokenValue,
      }
    );

    if ("message" in response.data) {
      throw new Error("리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.");
    }

    return response.data;
  } catch (error) {
    console.error("토큰 갱신 요청 실패:", error);
    if (error && typeof error === "object" && "response" in error) {
      const responseData = (error as any).response?.data;
      if (responseData?.message) {
        console.error("서버 메시지:", responseData.message);
      }
    }
    throw error;
  }
};

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiError } from "./types";
import { refreshToken } from "./auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://front-mission.bigs.or.kr";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const isAuthEndpoint =
      config.url?.includes("/auth/signin") ||
      config.url?.includes("/auth/signup");

    if (!isAuthEndpoint) {
      let token: string | null = null;

      if (typeof window !== "undefined") {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; access-token=`);
        if (parts.length === 2) {
          token = parts.pop()?.split(";").shift() || null;
        }
      } else {
        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          token = cookieStore.get("access-token")?.value || null;
        } catch {
          token = null;
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    console.log("API 요청:", {
      url: config.url,
      method: config.method,
      hasAuth: !!config.headers.Authorization,
    });

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/signin") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        let refreshTokenValue: string | null = null;

        if (typeof window !== "undefined") {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; refresh-token=`);
          if (parts.length === 2) {
            refreshTokenValue = parts.pop()?.split(";").shift() || null;
          }
        } else {
          try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            refreshTokenValue = cookieStore.get("refresh-token")?.value || null;
          } catch {
            refreshTokenValue = null;
          }
        }

        if (refreshTokenValue) {
          const newTokens = await refreshToken(refreshTokenValue);
          console.log("토큰 갱신 성공");
          if (typeof window !== "undefined") {
            document.cookie = `access-token=${newTokens.accessToken}; path=/; max-age=3600`;
            document.cookie = `refresh-token=${newTokens.refreshToken}; path=/; max-age=604800`;
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          }

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error(
          "세션이 만료되었습니다. 다시 로그인해주세요.",
          refreshError
        );
        if (typeof window !== "undefined") {
          document.cookie =
            "access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
          document.cookie =
            "refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

          alert("세션이 만료되었습니다. 다시 로그인해주세요.");

          const currentPath = window.location.pathname + window.location.search;
          const redirectUrl = `/login?redirect=${encodeURIComponent(
            currentPath
          )}`;
          window.location.href = redirectUrl;
        }
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      console.error("API 에러:", {
        status: error.response.status,
        url: originalRequest.url,
        message: error.response.data,
      });
    } else {
      console.error("네트워크 에러:", error.message);
    }

    if (error.response?.status === 403) {
      console.error("접근 권한이 없습니다.");
    }

    if (error.response?.status === 404) {
      console.error("요청한 리소스를 찾을 수 없습니다.");
    }

    if (error.response?.status === 500) {
      console.error("서버 에러가 발생했습니다.");
    }

    if (!error.response) {
      console.error("네트워크 연결을 확인해주세요.");
    }

    return Promise.reject(error);
  }
);

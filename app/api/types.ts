// Auth
export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  name?: string;
  exp: number;
  iat: number;
}

// Board (목록용)
export interface Board {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl: string | null;
  createdAt: string;
}

// BoardDetail (상세용)
export interface BoardDetail {
  id: number;
  title: string;
  content: string;
  boardCategory: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface Sort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface BoardListResponse {
  content: Board[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  empty: boolean;
}

export interface BoardRequestData {
  title: string;
  content: string;
  category: string;
}

export interface CreateBoardRequest {
  request: BoardRequestData;
  file?: File | null;
}

export interface UpdateBoardRequest {
  request: BoardRequestData;
  file?: File | null;
}

// API 공통
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export type BoardCategoryKey = "NOTICE" | "FREE" | "QNA" | "ETC";

export type BoardCategories = {
  [key in BoardCategoryKey]: string;
};

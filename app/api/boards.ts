import { apiClient } from "./client";
import type {
  Board,
  BoardDetail,
  BoardCategories,
  BoardListResponse,
  CreateBoardRequest,
  UpdateBoardRequest,
} from "./types";

// 글 쓰기
export const createBoard = async (data: CreateBoardRequest): Promise<Board> => {
  const formData = new FormData();

  const requestBlob = new Blob([JSON.stringify(data.request)], {
    type: "application/json",
  });
  formData.append("request", requestBlob);

  if (data.file) {
    formData.append("file", data.file);
  }

  const response = await apiClient.post<Board>("/boards", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 글 수정
export const updateBoard = async (
  id: string,
  data: UpdateBoardRequest
): Promise<Board> => {
  const formData = new FormData();

  const requestBlob = new Blob([JSON.stringify(data.request)], {
    type: "application/json",
  });
  formData.append("request", requestBlob);

  if (data.file) {
    formData.append("file", data.file);
  }

  const response = await apiClient.patch<Board>(`/boards/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 글 삭제
export const deleteBoard = async (id: string): Promise<void> => {
  await apiClient.delete(`/boards/${id}`);
};

// 글 조회
export const getBoard = async (id: string): Promise<BoardDetail> => {
  const response = await apiClient.get<BoardDetail>(`/boards/${id}`);
  return response.data;
};

// 글 목록 조회
export const getBoards = async (
  page: number,
  size: number
): Promise<BoardListResponse> => {
  const response = await apiClient.get<BoardListResponse>(
    `/boards?page=${page}&size=${size}`
  );
  return response.data;
};

// 게시판 카테고리
export const getBoardCategories = async (): Promise<BoardCategories> => {
  const response = await apiClient.get<BoardCategories>(`/boards/categories`);
  return response.data;
};

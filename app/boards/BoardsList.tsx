"use client";

import { useMemo } from "react";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getBoards, getBoardCategories } from "@/app/api";
import { BOARDS_SIZE } from "@/lib/constants";
import Link from "next/link";

const BoardsList = () => {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "ALL";

  const { data } = useSuspenseQuery({
    queryKey: ["boards", { page: 0, size: BOARDS_SIZE }],
    queryFn: async () => await getBoards(0, BOARDS_SIZE),
  });

  const { data: categories } = useQuery({
    queryKey: ["boardCategories"],
    queryFn: getBoardCategories,
  });

  const filteredBoards = useMemo(() => {
    if (!data?.content) return [];
    if (selectedCategory === "ALL") return data.content;
    return data.content.filter((board) => board.category === selectedCategory);
  }, [data?.content, selectedCategory]);

  return (
    <div>
      <div className="space-y-4">
        {filteredBoards.length ? (
          filteredBoards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all hover:border-blue-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                  {(categories as Record<string, string>)?.[board.category] ||
                    board.category}
                </span>
                {board.imageUrl && (
                  <span className="text-sm text-gray-400">📎 이미지</span>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
                {board.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(board.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            {selectedCategory === "ALL"
              ? "게시글이 없습니다."
              : "해당 카테고리에 게시글이 없습니다."}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardsList;

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getBoards, getBoardCategories } from "@/app/api";
import BoardsList from "./BoardsList";
import CategoryFilter from "./CategoryFilter";
import { BOARDS_SIZE } from "@/lib/constants";
import { Suspense } from "react";
import Link from "next/link";

const BoardsPage = async () => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["boards", { page: 0, size: BOARDS_SIZE }],
      queryFn: async () => await getBoards(0, BOARDS_SIZE),
    }),
    queryClient.prefetchQuery({
      queryKey: ["boardCategories"],
      queryFn: getBoardCategories,
    }),
  ]);

  const categories = await getBoardCategories();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                게시판
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                다양한 주제로 소통하고 정보를 공유하세요
              </p>
            </div>
            <Link
              href="/boards/new"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg whitespace-nowrap self-start sm:self-auto"
            >
              + 글 작성
            </Link>
          </div>
        </div>

        <CategoryFilter categories={categories} />

        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense
            fallback={
              <div className="text-center py-12 text-gray-500">로딩 중...</div>
            }
          >
            <BoardsList />
          </Suspense>
        </HydrationBoundary>
      </div>
    </main>
  );
};

export default BoardsPage;

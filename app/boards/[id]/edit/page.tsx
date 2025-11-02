import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getBoard, getBoardCategories } from "@/app/api";
import BoardEditForm from "./BoardEditForm";
import { Suspense } from "react";
import Link from "next/link";

interface BoardEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const BoardEditPage = async ({ params }: BoardEditPageProps) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["board", id],
      queryFn: async () => await getBoard(id),
    }),
    queryClient.prefetchQuery({
      queryKey: ["boardCategories"],
      queryFn: getBoardCategories,
    }),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              글 수정
            </h1>
            <Link
              href={`/boards/${id}`}
              className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
            >
              ← 글 보기
            </Link>
          </div>
          <p className="text-sm md:text-base text-gray-600">
            게시글을 수정하세요
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense
              fallback={
                <div className="text-center py-12 text-gray-500">
                  로딩 중...
                </div>
              }
            >
              <BoardEditForm id={id} />
            </Suspense>
          </HydrationBoundary>
        </div>
      </div>
    </main>
  );
};

export default BoardEditPage;

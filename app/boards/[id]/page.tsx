import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getBoard } from "@/app/api";
import BoardDetail from "./BoardDetail";
import { Suspense } from "react";

interface BoardDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const BoardDetailPage = async ({ params }: BoardDetailPageProps) => {
  const { id } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["board", id],
    queryFn: async () => await getBoard(id),
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <BoardDetail id={id} />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
};

export default BoardDetailPage;

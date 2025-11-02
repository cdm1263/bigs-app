"use client";

import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { getBoard, deleteBoard, getBoardCategories } from "@/app/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BoardDetailProps {
  id: string;
}

const BoardDetail = ({ id }: BoardDetailProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: board } = useSuspenseQuery({
    queryKey: ["board", id],
    queryFn: async () => await getBoard(id),
  });

  const { data: categories } = useQuery({
    queryKey: ["boardCategories"],
    queryFn: getBoardCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      router.push("/boards");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "글 삭제에 실패했습니다.");
    },
  });

  const handleDelete = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 pb-6 border-b">
        <div className="mb-3">
          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">
            {(categories as Record<string, string>)?.[board.boardCategory] ||
              board.boardCategory}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-4">{board.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{new Date(board.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {board.imageUrl && (
        <div className="mb-8">
          <img
            src={board.imageUrl}
            alt={board.title}
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}

      <div className="prose max-w-none mb-8">
        <div className="whitespace-pre-wrap">{board.content}</div>
      </div>

      <div className="flex gap-3 justify-between">
        <Link
          href="/boards"
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          목록으로
        </Link>
        <div className="flex gap-3">
          <Link
            href={`/boards/${id}/edit`}
            className="px-6 py-2 border rounded-lg hover:bg-primary-foreground"
          >
            수정
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {deleteMutation.isPending ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;

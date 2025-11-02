import BoardCreateForm from "./BoardCreateForm";
import Link from "next/link";

const BoardCreatePage = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              새 글 작성
            </h1>
            <Link
              href="/boards"
              className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
            >
              ← 목록으로
            </Link>
          </div>
          <p className="text-sm md:text-base text-gray-600">
            새로운 게시글을 작성하세요
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <BoardCreateForm />
        </div>
      </div>
    </main>
  );
};

export default BoardCreatePage;

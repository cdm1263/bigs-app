import { MainPageButtons } from "@/components/MainPageButtons";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
          환영합니다
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-12">
          Bigs 게시판에 오신 것을 환영합니다
        </p>

        <MainPageButtons />
      </div>
    </div>
  );
}

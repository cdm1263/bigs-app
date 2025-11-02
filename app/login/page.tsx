import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              로그인
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              계정에 로그인하여 시작하세요
            </p>
          </div>

          <Suspense
            fallback={
              <div className="text-center py-8 text-gray-500">로딩 중...</div>
            }
          >
            <LoginForm />
          </Suspense>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              계정이 없으신가요?{" "}
              <Link
                href="/signup"
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
              >
                회원가입
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
            >
              ← 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

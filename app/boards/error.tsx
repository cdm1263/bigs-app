"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const Error = ({ error, reset }: ErrorProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthError =
    error.message.includes("401") ||
    error.message.includes("Unauthorized") ||
    error.message.includes("세션") ||
    error.message.includes("인증") ||
    error.message.includes("로그인");

  useEffect(() => {
    console.error("에러 발생:", error);

    if (isAuthError) {
      const timer = setTimeout(() => {
        const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
        router.push(redirectUrl);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, router, pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* 에러 아이콘 */}
        <div className="flex justify-center mb-4">
          {isAuthError ? (
            <svg
              className="w-16 h-16 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          ) : (
            <svg
              className="w-16 h-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {isAuthError ? "인증이 필요합니다" : "오류가 발생했습니다"}
        </h2>

        <div className="mb-6">
          {isAuthError ? (
            <div className="space-y-2">
              <p className="text-center text-gray-600">
                세션이 만료되었거나 로그인이 필요합니다.
              </p>
              <p className="text-center text-sm text-gray-500">
                3초 후 자동으로 로그인 페이지로 이동합니다...
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-mono wrap-break-word">
                {error.message}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {isAuthError ? (
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              로그인 페이지로 이동
            </Link>
          ) : (
            <button
              onClick={() => reset()}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              다시 시도
            </button>
          )}

          <Link
            href="/"
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-center"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;

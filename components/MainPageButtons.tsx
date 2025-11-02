"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import type { JwtPayload } from "@/app/api/types";

export const MainPageButtons = () => {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="w-full sm:w-40 h-12 bg-gray-200 rounded-lg animate-pulse" />
        <div className="w-full sm:w-40 h-12 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {!user ? (
        <>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg border-2 border-blue-600"
          >
            회원가입
          </Link>
        </>
      ) : (
        <Link
          href="/boards/new"
          className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
        >
          글 작성하기
        </Link>
      )}
      <Link
        href="/boards"
        className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
      >
        게시글 보기
      </Link>
    </div>
  );
};

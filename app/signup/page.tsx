import { SignupForm } from "./SignupForm";
import Link from "next/link";

const SignupPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              회원가입
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              새로운 계정을 만들어 시작하세요
            </p>
          </div>

          <SignupForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
              >
                로그인
              </Link>
            </p>
          </div>

          {/* 홈으로 돌아가기 */}
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

export default SignupPage;

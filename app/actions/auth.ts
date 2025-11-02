"use server";

import { cookies } from "next/headers";
import { signIn, signUp } from "@/app/api/auth";

export const loginAction = async (formData: FormData) => {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const cookieStore = await cookies();

  try {
    const res = await signIn({ username, password });

    cookieStore.set("access-token", res.accessToken);
    cookieStore.set("refresh-token", res.refreshToken);
    return {
      ok: true as const,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    };
  } catch (error: unknown) {
    const message = (error as { message?: string })?.message || "로그인 실패";
    return { ok: false as const, error: message };
  }
};

export const signUpAction = async (formData: FormData) => {
  const username = String(formData.get("username") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  try {
    await signUp({ username, name, password, confirmPassword });

    return { ok: true as const };
  } catch (error: unknown) {
    const message = (error as { message?: string })?.message || "회원가입 실패";
    return { ok: false as const, error: message };
  }
};

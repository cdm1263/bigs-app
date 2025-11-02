"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://front-mission.bigs.or.kr";

export async function updateBoardAction(
  id: string,
  title: string,
  content: string,
  category: string,
  file: File | null
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value;

  const apiFormData = new FormData();

  const requestBlob = new Blob(
    [
      JSON.stringify({
        title,
        content,
        category,
      }),
    ],
    {
      type: "application/json",
    }
  );
  apiFormData.append("request", requestBlob);

  if (file && file.size > 0) {
    apiFormData.append("file", file);
  }

  try {
    const response = await fetch(`${API_URL}/boards/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: apiFormData,
    });

    const responseText = await response.text();
    console.log("Response status:", response.status);
    console.log("Response text:", responseText);

    if (!response.ok) {
      let errorMessage = "글 수정에 실패했습니다.";
      try {
        const error = JSON.parse(responseText);
        errorMessage = error.message || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }
      return { success: false, error: errorMessage };
    }

    let data = null;
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        return { success: false, error: "응답 파싱 중 오류가 발생했습니다." };
      }
    }

    revalidatePath(`/boards/${id}`);
    revalidatePath("/boards");

    return { success: true, data };
  } catch (error) {
    console.error("Board update error:", error);
    return { success: false, error: "글 수정 중 오류가 발생했습니다." };
  }
}

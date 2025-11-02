import { z } from "zod";

export const loginSchema = z.object({
  username: z.email("올바른 이메일 형식을 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    username: z.email("올바른 이메일 형식을 입력해주세요"),
    name: z.string().min(1, "이름을 입력해주세요"),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다")
      .regex(
        /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!%*#?&]).{8,}$/,
        "비밀번호는 8자 이상, 숫자, 영문자, 특수문자(!%*#?&) 1개 이상의 조합이어야 합니다"
      ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export const boardSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  content: z.string().min(1, "내용을 입력해주세요"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  file: z.instanceof(File).optional().nullable(),
});

export type BoardFormData = z.infer<typeof boardSchema>;

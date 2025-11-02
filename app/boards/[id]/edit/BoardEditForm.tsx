"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getBoard, getBoardCategories } from "@/app/api";
import { updateBoardAction } from "@/app/actions/boards";
import { boardSchema, type BoardFormData } from "@/lib/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BoardEditFormProps {
  id: string;
}

const BoardEditForm = ({ id }: BoardEditFormProps) => {
  const router = useRouter();

  const { data: board } = useSuspenseQuery({
    queryKey: ["board", id],
    queryFn: async () => await getBoard(id),
  });

  const { data: categories } = useQuery({
    queryKey: ["boardCategories"],
    queryFn: getBoardCategories,
  });

  const categoryEntries = categories
    ? (Object.entries(categories) as [string, string][])
    : [];

  const form = useForm<BoardFormData>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      file: null,
    },
  });

  useEffect(() => {
    if (board) {
      form.reset({
        title: board.title,
        content: board.content,
        category: board.boardCategory,
        file: null,
      });
    }
  }, [board, form]);

  const onSubmit = async (values: BoardFormData) => {
    const result = await updateBoardAction(
      id,
      values.title,
      values.content,
      values.category,
      values.file || null
    );

    if (result.success) {
      router.push(`/boards/${id}`);
      router.refresh();
    } else {
      throw new Error(result.error || "글 수정에 실패했습니다.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                카테고리 <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryEntries.map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                제목 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="제목을 입력하세요"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                내용 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="내용을 입력하세요"
                  rows={15}
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>
                파일 첨부{" "}
                <span className="text-gray-400 font-normal">(선택사항)</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onChange(file);
                  }}
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              {value && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-700 font-medium">
                    {value.name}
                  </span>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex-1 sm:flex-none"
          >
            {form.formState.isSubmitting ? "수정 중..." : "수정하기"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
            className="flex-1 sm:flex-none"
          >
            취소
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BoardEditForm;

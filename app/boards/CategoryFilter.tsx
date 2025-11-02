"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { BoardCategories } from "@/app/api/types";

interface CategoryFilterProps {
  categories: BoardCategories;
}

const CategoryFilter = ({ categories }: CategoryFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "ALL";

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === "ALL") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    router.push(`/boards?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        onClick={() => handleCategoryChange("ALL")}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedCategory === "ALL"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        전체
      </button>
      {Object.entries(categories).map(([key, value]) => (
        <button
          key={key}
          onClick={() => handleCategoryChange(key)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === key
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {value}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

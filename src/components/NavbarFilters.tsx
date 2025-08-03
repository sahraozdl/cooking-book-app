"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function NavbarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";

  const onCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory) {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }
    router.replace(`?${params.toString()}`);
  };

  const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (newSort) {
      params.set("sort", newSort);
    } else {
      params.delete("sort");
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <nav className="flex items-center gap-4 p-4 bg-gray-100">
      <select value={category} onChange={onCategoryChange}>
        <option value="">All Categories</option>
        <option value="italian">Italian</option>
        <option value="mexican">Mexican</option>
        {/* add your categories dynamically if needed */}
      </select>

      <select value={sort} onChange={onSortChange}>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="popular">Most Popular</option>
      </select>
    </nav>
  );
}

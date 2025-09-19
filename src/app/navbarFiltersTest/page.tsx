"use client";

import NavbarFilters, { FilterOption } from "@/components/NavbarFilters";

export default function NavbarFiltersTestPage() {
  const categories: FilterOption[] = [{ id: "1", name: "Breakfast" }];
  const cuisines: FilterOption[] = [{ id: "1", name: "Italian" }];
  const difficulties: FilterOption[] = [{ id: "1", name: "Easy" }];
  const servings: FilterOption[] = [{ id: "1", name: "2 people" }];

  return (
    <div className="p-8">
      <NavbarFilters
        categories={categories}
        cuisines={cuisines}
        difficulties={difficulties}
        servings={servings}
      />
    </div>
  );
}

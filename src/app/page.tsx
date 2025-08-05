import NavbarFilters from "@/components/NavbarFilters";
import FilteredRecipeList from "@/components/FilteredRecipeList";
import { getAllCategories, getAllCuisines, getAllDifficulties, getAllServings } from "@/app/lib/firebase/dataFetchers";

export default async function HomePage() {
  const categories = await getAllCategories();
  const cuisines = await getAllCuisines();
  const difficulties = await getAllDifficulties();
  const servings = await getAllServings();

  return (
    <div className="space-y-6">
      <NavbarFilters
        categories={categories}
        cuisines={cuisines}
        difficulties={difficulties}
        servings={servings}
      />
      <FilteredRecipeList />
    </div>
  );
}

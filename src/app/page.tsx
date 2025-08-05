"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getFilteredSortedRecipes } from "@/app/actions/firestoreRecipeActions";
import EntryCard from "@/components/EntryCard";
import { RecipeWithID } from "@/types";

function parseArrayParam(param: string | null): string[] {
  if (!param) return [];
  return param.split(",").filter(Boolean);
}

export default function HomePage() {
  const searchParams = useSearchParams();

  const categories = parseArrayParam(searchParams.get("categories"));
  const cuisines = parseArrayParam(searchParams.get("cuisineId"));
  const difficulties = parseArrayParam(searchParams.get("difficultyIds"));
  const servings = parseArrayParam(searchParams.get("servingsIds"));

  const sort = searchParams.get("sort") || "newest";

  const [recipes, setRecipes] = useState<RecipeWithID[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getFilteredSortedRecipes(sort, {
      categories,
      cuisineId: cuisines,
      difficultyIds: difficulties,
      servingsIds: servings,
    }).then((data) => {
      const filtered = data.filter((recipe) => {
        const matchesCuisine =
          cuisines.length === 0 ||
          (recipe.cuisineId && cuisines.includes(recipe.cuisineId.id));
        const matchesDifficulty =
          difficulties.length === 0 ||
          (recipe.difficultyId &&
            difficulties.includes(recipe.difficultyId.id));
        const matchesServings =
          servings.length === 0 ||
          (recipe.servingsId && servings.includes(recipe.servingsId.id));

        return matchesCuisine && matchesDifficulty && matchesServings;
      });

      setRecipes(filtered);
      setLoading(false);
    });
  }, [
    sort,
    categories.join(","),
    cuisines.join(","),
    difficulties.join(","),
    servings.join(","),
  ]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">🍳 Community Recipes</h1>

      {loading ? (
        <p>Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p>No public recipes found.</p>
      ) : (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <EntryCard key={recipe.id} entry={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

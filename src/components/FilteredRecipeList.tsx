"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getFilteredSortedRecipesFromParams } from "@/app/actions/getFilteredSortedRecipesFromParams";
import { RecipeWithID } from "@/types";
import RecipeList from "./RecipeList";

export default function FilteredRecipeList() {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<RecipeWithID[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      const data = await getFilteredSortedRecipesFromParams(searchParams);
      setRecipes(data);
      setLoading(false);
    };

    fetchRecipes();
  }, [searchParams]);

  return (
    <RecipeList
      recipes={recipes}
      loading={loading}
    />
  );
}

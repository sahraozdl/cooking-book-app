"use client";

import { useEffect, useState } from "react";
import { getPublicRecipes } from "@/store/firebase/queries/getPublicRecipes";
import EntryCard from "@/components/EntryCard";
import { RecipeFormData } from "@/types/recipes";

export default function HomePage() {
  const [recipes, setRecipes] = useState<RecipeFormData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicRecipes().then((data) => {
      setRecipes(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">🍳 Community Recipes</h1>

      {loading ? (
        <p>Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p>No public recipes found.</p>
      ) : (
        <div className="space-y-4">
          {recipes.map((entry) => (
            <EntryCard key={entry.idMeal} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
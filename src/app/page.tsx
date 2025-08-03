"use client";

import { useEffect, useState } from "react";
import { getPublicRecipes } from "@/app/actions/firestoreRecipes";
import EntryCard from "@/components/EntryCard";
import { RecipeWithID } from "@/types/recipes";

export default function HomePage() {
  const [recipes, setRecipes] = useState<RecipeWithID[]>([]);
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
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

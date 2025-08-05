import React from "react";
import EntryCard from "./EntryCard";
import { RecipeWithID } from "@/types";

interface RecipeListProps {
  recipes: RecipeWithID[];
  loading?: boolean;
  editable?: boolean;
  onDelete?: (id: string) => void;
  deletingId?: string | null;
}

export default function RecipeList({
  recipes,
  loading = false,
  editable = false,
  onDelete,
  deletingId,
}: RecipeListProps) {
  if (loading) return <p>Loading recipes...</p>;
  if (recipes.length === 0) return <p>No recipes found.</p>;

  return (
    <div className="space-y-4">
      {recipes.map((recipe) => (
        <EntryCard
          key={recipe.id}
          entry={recipe}
          editable={editable}
          onDelete={onDelete ? () => onDelete(recipe.id) : undefined}
          isDeleting={deletingId === recipe.id}
        />
      ))}
    </div>
  );
}

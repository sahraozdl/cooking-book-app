"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  toggleRecipeLike,
  toggleRecipeSave,
} from "@/app/actions/firestoreRecipeActions";
import { useUser } from "@/components/UserContext";
import { RecipeWithID } from "@/types/recipes";

interface EntryCardProps {
  entry: RecipeWithID;
  showAuthor?: boolean;
  editable?: boolean;
  onDelete?: () => void;
  onUpdate?: (updatedData: Partial<RecipeWithID>) => void;
  isDeleting?: boolean;
}

export default function EntryCard({
  entry,
  showAuthor = true,
  editable = false,
  onDelete,
  onUpdate,
  isDeleting = false,
}: EntryCardProps) {
  const { user } = useUser();
  const router = useRouter();

  const userId = user?.id;

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLiked(false);
      setSaved(false);
      return;
    }
    setLiked(entry.likedBy?.includes(userId) ?? false);
    setSaved(entry.savedBy?.includes(userId) ?? false);
  }, [entry, userId]);

  const handleEdit = () => {
    if (!entry.id) return;
    router.push(`/recipes/edit/${entry.id}`);
  };

  const handleToggle = async (type: "like" | "save") => {
    if (!userId) {
      router.push("/login");
      return;
    }
    if (!entry.id) return;

    const toggler = type === "like" ? toggleRecipeLike : toggleRecipeSave;
    const currentState = type === "like" ? liked : saved;
    const newState = !currentState;

    try {
      if (type === "like") setLiked(newState);
      else setSaved(newState);
      const countKey = type === "like" ? "likeCount" : "saveCount";
      const byKey = type === "like" ? "likedBy" : "savedBy";

      entry[countKey] = Math.max(
        (entry[countKey] ?? entry[byKey]?.length ?? 0) + (newState ? 1 : -1),
        0
      );

      entry[byKey] = newState
        ? [...(entry[byKey] ?? []), userId]
        : (entry[byKey] ?? []).filter((id) => id !== userId);

      await toggler(entry.id, userId);
    } catch (error) {
      console.error(`Failed to toggle ${type}:`, error);
      if (type === "like") setLiked(currentState);
      else setSaved(currentState);
    }
  };

  return (
    <div className="border rounded-xl p-4 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
      <div className="flex items-start gap-4">
        {entry.strMealThumb && (
          <Image
            src={entry.strMealThumb}
            alt={entry.strMeal}
            width={100}
            height={100}
            className="rounded-lg object-cover w-24 h-24"
          />
        )}

        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-semibold dark:text-white">
            {entry.strMeal}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {entry.strInstructions}
          </p>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-2">
            <span>🍽️ Servings: {entry.servingsId}</span>
            <span>🌶️ Difficulty: {entry.difficultyId}</span>
            <span>🌍 Cuisine: {entry.cuisineId}</span>
          </div>

          {showAuthor && entry.authorId && (
            <p className="text-sm">
              By:{" "}
              {entry.isAnonymous ? (
                "Anonymous"
              ) : (
                <Link
                  href={`/profile/${entry.authorId}`}
                  className="text-blue-600 hover:underline"
                >
                  {entry.authorName}
                </Link>
              )}
            </p>
          )}

          <div className="flex gap-4 mt-2 items-center">
            <button
              onClick={() => handleToggle("like")}
              className={`text-sm ${
                liked ? "text-red-500" : "text-gray-500"
              } hover:underline`}
            >
              ❤️ {liked ? "Liked" : "Like"} (
              {entry.likeCount ?? entry.likedBy?.length ?? 0})
            </button>

            <button
              onClick={() => handleToggle("save")}
              className={`text-sm ${
                saved ? "text-green-600" : "text-gray-500"
              } hover:underline`}
            >
              📌 {saved ? "Saved" : "Save"} (
              {entry.saveCount ?? entry.savedBy?.length ?? 0})
            </button>

            <Link
              href={`/recipes/${entry.id}`}
              className="ml-auto text-purple-600 hover:underline text-sm"
            >
              View full recipe
            </Link>

            {editable && (
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={handleEdit}
                  className="btn btn-sm btn-primary"
                  aria-label="Edit recipe"
                >
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  disabled={isDeleting}
                  className={`btn btn-sm btn-danger ${
                    isDeleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  aria-label="Delete recipe"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

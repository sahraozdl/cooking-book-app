"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  toggleRecipeLike,
  toggleRecipeSave,
} from "@/app/actions/firestoreRecipes";
import { useUser } from "@/components/UserContext"; // adjust based on your setup
import { RecipeWithID } from "@/types/recipes";
import { useRouter } from "next/navigation";

interface EntryCardProps {
  entry: RecipeWithID;
  showAuthor?: boolean;
}

export default function EntryCard({
  entry,
  showAuthor = true,
}: EntryCardProps) {
  const { user } = useUser(); // assumes you have a context with user.id
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLiked(user.id ? entry.likedBy?.includes(user.id) ?? false : false);
    setSaved(user.id ? entry.savedBy?.includes(user.id) ?? false : false);
  }, [entry, user]);

  const router = useRouter();

  const handleToggle = async (type: "like" | "save") => {
    if (!user?.id) {
      router.push("/login");
      return;
    }
    if (!entry.id) return;

    const isLike = type === "like";
    const toggler = isLike ? toggleRecipeLike : toggleRecipeSave;

    try {
      const newState = isLike ? !liked : !saved;

      // Optimistically update UI
      if (isLike) {
        setLiked(newState);
      } else {
        setSaved(newState);
      }

      // Update count and array locally
      if (isLike) {
        entry.likeCount = Math.max(
          (entry.likeCount ?? entry.likedBy?.length ?? 0) + (newState ? 1 : -1),
          0
        );
      } else {
        entry.saveCount = Math.max(
          (entry.saveCount ?? entry.savedBy?.length ?? 0) + (newState ? 1 : -1),
          0
        );
      }

      if (newState) {
        entry[`${type}dBy`] = [...(entry[`${type}dBy`] ?? []), user.id];
      } else {
        entry[`${type}dBy`] =
          entry[`${type}dBy`]?.filter((id) => id !== user.id) ?? [];
      }

      await toggler(entry.id, user.id);
    } catch (error) {
      console.error(`Failed to toggle ${type}:`, error);
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
              By: {entry.isAnonymous ? "Anonymous" : entry.authorName}
            </p>
          )}

          <div className="flex gap-4 mt-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { RecipeFormData } from "@/types/recipes";

interface EntryCardProps {
  entry: RecipeFormData;
  showAuthor?: boolean;
}

export default function EntryCard({ entry, showAuthor = true }: EntryCardProps) {
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
          <h3 className="text-lg font-semibold dark:text-white">{entry.strMeal}</h3>
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

          <Link
            href={`/recipes/${entry.idMeal}`}
            className="inline-block mt-2 text-purple-600 hover:underline text-sm"
          >
            View full recipe
          </Link>
        </div>
      </div>
    </div>
  );
}

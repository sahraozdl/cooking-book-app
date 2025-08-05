"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getPublicRecipesFromFollowedUsers } from "@/app/actions/firestoreRecipeActions";
import { useUser } from "@/store/UserContext";
import { RecipeWithID } from "@/types";
import RecipeList from "@/components/RecipeList";

export default function DashboardPage() {
  const { user } = useUser();
  const [entries, setEntries] = useState<RecipeWithID[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      if (user?.following && user.following.length > 0) {
        const fetchedEntries = await getPublicRecipesFromFollowedUsers(
          user.following
        );
        setEntries(fetchedEntries);
      }
    };

    fetchEntries();
  }, [user?.following]);

  return (
    <ProtectedRoute>
      <div className="space-y-4 p-4 text-gray-900">
        <h1 className="text-2xl font-bold">Feed</h1>
        <RecipeList 
        recipes={entries}
        />
      </div>
    </ProtectedRoute>
  );
}

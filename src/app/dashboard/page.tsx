"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getPublicRecipesFromFollowedUsers } from "@/app/actions/firestoreRecipeActions";
import EntryCard from "@/components/EntryCard";
import { useUser } from "@/store/UserContext";
import { RecipeWithID } from "@/types";

export default function DashboardPage() {
  const { user } = useUser();
  const [entries, setEntries] = useState<RecipeWithID[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      if (user?.following && user.following.length > 0) {
        const fetchedEntries = await getPublicRecipesFromFollowedUsers(
          user.following
        );
        setEntries(fetchedEntries);
      }
      setLoading(false);
    };

    fetchEntries();
  }, [user?.following]);

  return (
    <ProtectedRoute>
      <div className="space-y-4 p-4">
        <h1 className="text-2xl font-bold">Feed</h1>
        {loading ? (
          <p>Loading entries...</p>
        ) : entries.length === 0 ? (
          <p>No entries to show.(because you do not follow anyone)</p>
        ) : (
          entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} showAuthor={true} />
          ))
        )}
      </div>
    </ProtectedRoute>
  );
}

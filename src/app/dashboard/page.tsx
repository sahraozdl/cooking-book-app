"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getPublicEntriesFromFollowedUsers } from "@/store/firebase/firestoreEntries";
import EntryCard from "@/components/EntryCard";
import { useUser } from "@/components/UserContext";
import { RecipeFormData } from "@/types/recipes";

export default function DashboardPage() {
  const { user } = useUser();
  const [entries, setEntries] = useState<RecipeFormData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      if (user?.following && user.following.length > 0) {
        const fetchedEntries = await getPublicEntriesFromFollowedUsers(
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
            <EntryCard key={entry.idMeal} entry={entry} showAuthor={true} />
          ))
        )}
      </div>
    </ProtectedRoute>
  );
}

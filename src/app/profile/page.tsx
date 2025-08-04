"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/components/UserContext";
import { RecipeWithID } from "@/types/recipes";
import {
  getPublicRecipes,
  deleteRecipe,
} from "@/app/actions/firestoreRecipeActions";
import EditModal from "@/components/EditModal";
import EntryCard from "@/components/EntryCard";
import ProfileForm from "@/components/forms/ProfileForm";

export default function ProfilePage() {
  const { user } = useUser();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<RecipeWithID[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const userRecipes = await getPublicRecipes(user.id);
        setRecipes(userRecipes);
      } catch (error) {
        console.error("Failed to fetch user recipes:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, [user]);

  if (!user) return <p>Loading user...</p>;

  const handleDelete = async (recipeId: string) => {
    if (!user?.id) return;
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    setDeletingId(recipeId);
    try {
      await deleteRecipe(recipeId, user.id);
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{user.name || "No name"}</h1>
        <button onClick={() => setShowModal(true)} className="btn">
          Edit Profile
        </button>
      </div>

      <p className="text-gray-500">{user.email}</p>

      <EditModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Edit Profile"
      >
        <ProfileForm user={user} onClose={() => setShowModal(false)} />
      </EditModal>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Your Recipes</h2>
        {loading ? (
          <p>Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <p>No recipes found.</p>
        ) : (
          recipes.map((recipe) => (
            <EntryCard
              key={recipe.id}
              entry={recipe}
              editable
              onDelete={() => handleDelete(recipe.id)}
              isDeleting={deletingId === recipe.id}
            />
          ))
        )}
      </section>
    </div>
  );
}

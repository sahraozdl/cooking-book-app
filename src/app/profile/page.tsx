"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/store/UserContext";
import { RecipeWithID } from "@/types";
import {
  getRecipesFromUser,
} from "@/app/actions/firestoreRecipeActions";
import EditModal from "@/components/EditModal";
import ProfileForm from "@/components/forms/ProfileForm";
import RecipeList from "@/components/RecipeList";
import SecondaryButton from "@/components/buttons/SecondaryButton";

export default function ProfilePage() {
  const { user } = useUser();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<RecipeWithID[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRecipes() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const userRecipes = await getRecipesFromUser(user.id);
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

  

  return (
    <div className="p-4 max-w-3xl mx-auto text-gray-900">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{user.name || "No name"}</h1>
        <SecondaryButton onClick={() => setShowModal(true)}>
          Edit Profile
        </SecondaryButton>
      </div>

      <p className="text-gray-500">{user.email}</p>

      <EditModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Edit Profile"
      >
        <ProfileForm
          user={user}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
          }}
        />
      </EditModal>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Your Recipes</h2>
        {loading ? (
          <p>Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <p>No recipes found.</p>
        ) : (
          <RecipeList recipes={recipes}
          
          editable={true}
          />
        )}
      </section>
    </div>
  );
}

import { addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, recipesCollectionRef } from "@/store/firebase/config";
import { recipeSchema } from "./schema";
import { UserTypes, NewRecipeFormState } from "@/types/recipes";

export async function saveRecipe(prevState: NewRecipeFormState | null, formData: FormData) {
  try {
    const ingredients: { strIngredient: string; strMeasure: string }[] = [];
    for (const [key, value] of formData.entries()) {
      const match = key.match(/^ingredients\[(\d+)\]\[(strIngredient|strMeasure)\]$/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2] as "strIngredient" | "strMeasure";
        if (!ingredients[index]) ingredients[index] = { strIngredient: "", strMeasure: "" };
        ingredients[index][field] = value as string;
      }
    }

    const filteredIngredients = ingredients.filter(
      (ing) => ing.strIngredient.trim() || ing.strMeasure.trim()
    );

    const rawData = {
      strMeal: formData.get("strMeal") as string,
      strInstructions: formData.get("strInstructions") as string,
      strMealThumb: formData.get("strMealThumb") as string,
      categories: JSON.parse(formData.get("categoriesJSON") as string || "[]"),
      cuisineId: formData.get("cuisineId") as string,
      difficultyId: formData.get("difficultyId") as string,
      servingsId: formData.get("servingsId") as string,
      ingredients: filteredIngredients,
      isAnonymous: formData.get("isAnonymous") === "true",
      visibility: (formData.get("visibility") as "public" | "private") || "private",
      authorName: formData.get("authorName") || "Unknown",
      authorId: formData.get("authorId") || null,
      likedBy: [],
      savedBy: [],
      likeCount: 0,
      saveCount: 0,
    };

    const validateData = recipeSchema.safeParse(rawData);
    if (!validateData.success) {
      return {
        success: false,
        message: "Validation failed. Please check your input.",
        errors: validateData.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    const docRef = await addDoc(recipesCollectionRef, {
      ...validateData.data,
      likeCount: 0,
      saveCount: 0,
      createdAt: serverTimestamp(),
    });
    const newRecipeId = docRef.id;

    if (validateData.data.authorId) {
      const userRef = doc(db, "users", validateData.data.authorId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() as UserTypes | undefined;

      const updatedWrites = [...(userData?.writes || []), newRecipeId];
      await updateDoc(userRef, {
        writes: updatedWrites,
        writesCount: updatedWrites.length,
      });
    }

    return {
      success: true,
      message: `Recipe with ID ${newRecipeId} saved successfully!`,
      inputs: validateData.data,
    };
  } catch (error) {
    console.error("Error saving recipe:", error);
    return {
      success: false,
      message: "Failed to save recipe. Please try again.",
      inputs: null,
    };
  }
}
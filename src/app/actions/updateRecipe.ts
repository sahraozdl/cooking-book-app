import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/store/firebase/config";
import { RecipeFormData } from "@/types/recipes";

type PartialRecipeWithOptionalID = Partial<RecipeFormData> & { id?: string };
export async function updateRecipe(
  recipeId: string,
  updatedData: PartialRecipeWithOptionalID
) {
  const recipeRef = doc(db, "recipes", recipeId);
  const recipeSnap = await getDoc(recipeRef);
  if (!recipeSnap.exists()) throw new Error("Recipe not found.");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...cleanData } = updatedData;
  await updateDoc(recipeRef, { ...cleanData, updatedAt: serverTimestamp() });
}
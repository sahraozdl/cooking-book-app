import { getDocs, query, where } from "firebase/firestore";
import { recipesCollectionRef } from "@/store/firebase/config";
import { RecipeFormData } from "@/types/recipes";

export async function getPublicRecipes(): Promise<RecipeFormData[]> {
  const q = query(
    recipesCollectionRef,
    where("visibility", "==", "public"),
    where("isAnonymous", "==", false)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    idMeal: doc.id,
    ...doc.data(),
  })) as RecipeFormData[];
}
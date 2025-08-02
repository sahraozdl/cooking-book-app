import { z } from "zod";
import { addDoc } from "firebase/firestore";
import { recipesCollectionRef } from "@/store/firebase/config";
import { NewRecipeFormState } from "@/types/recipes";
import { serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
// 1. Schema with all fields
const recipeSchema = z.object({
  strMeal: z.string().min(2, "Recipe name must be at least 2 characters long"),
  strInstructions: z.string().min(50, "Instructions must be at least 50 characters long"),
  strMealThumb: z.string().url("Please enter a valid URL"),
  categories: z.array(z.string()),
  cuisineId: z.string(),
  difficultyId: z.string(),
  servingsId: z.string(),
  ingredients: z.array(
    z.object({
      strIngredient: z.string(),
      strMeasure: z.string(),
    })
  ),
  isAnonymous: z.boolean().default(false),
  visibility: z.enum(["public", "private"]),
  authorName: z.string().min(1),
  authorId: z.string().nullable(),
});

export async function saveRecipe(
  prevState: NewRecipeFormState | null,
  formData: FormData
) {
  try {
    // 2. Extract ingredient fields
    const ingredients: { strIngredient: string; strMeasure: string }[] = [];

    for (const [key, value] of formData.entries()) {
      const match = key.match(/^ingredients\[(\d+)\]\[(strIngredient|strMeasure)\]$/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2] as "strIngredient" | "strMeasure";

        if (!ingredients[index]) {
          ingredients[index] = { strIngredient: "", strMeasure: "" };
        }
        ingredients[index][field] = value as string;
      }
    }

    // 3. Filter out empty ingredient rows
    const filteredIngredients = ingredients.filter(
      (ing) => ing.strIngredient.trim() || ing.strMeasure.trim()
    );

    // 4. Build raw data
    const rawData = {
      strMeal: formData.get("strMeal") as string,
      strInstructions: formData.get("strInstructions") as string,
      strMealThumb: formData.get("strMealThumb") as string,
      categories: JSON.parse(formData.get("categoriesJSON") as string || "[]"),
      cuisineId: formData.get("cuisineId") as string,
      difficultyId: formData.get("difficultyId") as string,
      servingsId: formData.get("servingsId") as string,
      ingredients: filteredIngredients,
      isAnonymous: formData.get("isAnonymous") === "true" ? true : false,
      visibility: (formData.get("visibility") as "public" | "private") || "private",
      authorName: formData.get("authorName") || "Unknown",
      authorId: formData.get("authorId") || null, // Optional if logged in
    };

    // 5. Validate
    const validateData = recipeSchema.safeParse(rawData);
    if (!validateData.success) {
      return {
        success: false,
        message: "Validation failed. Please check your input.",
        errors: validateData.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    // 6. Save to Firestore
    const docRef = await addDoc(recipesCollectionRef, {
      idMeal: uuidv4(),
      ...validateData.data,
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      message: `Recipe with ID ${docRef.id} saved successfully!`,
      inputs: validateData.data,
    };

  } catch (error) {
    console.error("🔥 Error saving recipe:", error);
    return {
      success: false,
      message: "Failed to save recipe. Please try again.",
      inputs: null,
    };
  }
}

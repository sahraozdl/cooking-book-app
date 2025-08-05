import { z } from "zod";
import { recipeSchema } from "@/app/actions/schema";

export type RecipeSchemaType = z.infer<typeof recipeSchema>;

export type NewRecipeFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>; // zod's `.flatten().fieldErrors`
  inputs?: Partial<RecipeSchemaType> & { id?: string }; // or whatever shape you're returning
};
import { z } from 'zod';
import { recipeSchema } from '@/app/actions/schema';

export type RecipeSchemaType = z.infer<typeof recipeSchema>;

export type NewRecipeFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  inputs?: Partial<RecipeSchemaType> & { id?: string };
};

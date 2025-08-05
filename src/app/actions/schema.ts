import { z } from "zod";

export const idLabelSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const recipeSchema = z.object({
  strMeal: z.string().min(2, "Recipe name must be at least 2 characters long"),
  strInstructions: z.string().min(50, "Instructions must be at least 50 characters long"),
  strMealThumb: z.string().url("Please enter a valid URL"),
  categories: z.array(idLabelSchema).min(1), 
  categoryIds: z.array(z.string()).optional(),
  cuisineId: idLabelSchema,                   
  difficultyId: idLabelSchema,
  servingsId: idLabelSchema,
  ingredients: z.array(
    z.object({
      strIngredient: z.string(),
      strMeasure: z.string(),
    })
  ),
  isAnonymous: z.boolean(),
  visibility: z.enum(["public", "private"]),
  authorName: z.string().min(1),
  authorId: z.string().nullable(),
  likedBy: z.array(z.string()).default([]),
  savedBy: z.array(z.string()).default([]),
  likeCount: z.number().default(0),
  saveCount: z.number().default(0),
});

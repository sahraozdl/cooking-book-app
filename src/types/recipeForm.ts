export interface Ingredient {
  strIngredient: string;
  strMeasure: string;
}
export interface RecipeFormData {
  categories?: { id: string; name: string }[];
  categoryIds?: string[];
  cuisineId?: {
    id: string;
    name: string;
  };
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  difficultyId?: { id: string; name: string };
  ingredients: Ingredient[];
  servingsId?: { id: string; name: string };
  authorId: string;
  authorName?: string;
  isAnonymous?: boolean;
  likedBy?: string[];
  savedBy?: string[];
  likeCount?: number;
  saveCount?: number;
  visibility: 'public' | 'private';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface RecipeWithID extends RecipeFormData {
  id: string;
}

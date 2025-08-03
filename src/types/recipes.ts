export interface NewRecipeFormState {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof RecipeFormData]?: string[];
  };
  inputs?: Partial<RecipeFormData>;
}

export interface Ingredient {
  strIngredient: string;
  strMeasure: string;
}
export interface RecipeFormData {
  categories: string[];
  cuisineId?: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  difficultyId?: string;
  ingredients: Ingredient[];
  servingsId: string;
  authorId: string;
  authorName?: string;
  isAnonymous?: boolean;
  likedBy?: string[];
  savedBy?: string[];
  likeCount?: number;
  saveCount?: number;
  visibility: "public" | "private";
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface RecipeWithID extends RecipeFormData {
  id: string;
}

export interface Category {
  id: string;
  name?: string;
  strCategoryDescription?: string;
  strCategoryThumb?: string;
}

export interface Cuisine {
  id: string;
  name?: string;
  region?: string;
}

export interface Difficulty {
  id: string;
  avgTime?: string;
  name?: string;
}
export interface Option {
  id: string;
  name?: string;
}

export interface SearchUser {
  id: string;
  name?: string;
  email?: string;
  photoURL?: string;
}

export interface UserTypes {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  photoURL?: string;
  createdAt?: Date;
  writes?: string[];
  following?: string[];
  followers?: string[];
  writesCount?: number;
  savedRecipes?: string[];  // ✅
  likedRecipes?: string[];  // ✅
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface NewRecipeFormState {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof RecipeFormData]?: string[];
  };
  inputs?:Partial<RecipeFormData>;
}

export interface Ingredient {
  strIngredient: string;
  strMeasure: string;
}
export interface RecipeFormData {
  idMeal?: string;
  strCategory: string[];
  cuisineId?: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  difficultyId?: string;
  strIngredient: Ingredient[];
  servingsId: string;
  authorId: string;
  authorName?: string;
  isAnonymous?: boolean;
  visibility: "public" | "private";
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}
export interface Category {
  id: string;
  idCategory: string;
  strCategory: string;
  strCategoryDescription: string;
  strCategoryThumb: string;
}

export interface Cuisine {
  id: string;
  name: string;
  region: string;
}

export interface Difficulty {
  id: string;
  avgTime: string;
  label: string;
}
export interface Option {
  id: string;
  name: string;
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
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
}
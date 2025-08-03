import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/store/firebase/config";
import { RecipeFormData, RecipeWithID } from "@/types/recipes";

interface Filters {
  categories?: string[];
  cuisineId?: string[];
  difficultyIds?: string[];
  servingsIds?: string[];
}

export async function getFilteredSortedRecipes(
  sort: string,
  filters: Filters = {}
) {
  const recipesRef = collection(db, "recipes");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const constraints: any[] = [];


  if (filters.categories && filters.categories.length > 0) {
    constraints.push(where("categories", "array-contains-any", filters.categories));
  }

  if (filters.cuisineId && filters.cuisineId.length > 0) {
    constraints.push(where("cuisineId", "in", filters.cuisineId));
  }

  if (filters.difficultyIds && filters.difficultyIds.length > 0) {
    constraints.push(where("difficultyId", "in", filters.difficultyIds));
  }

  if (filters.servingsIds && filters.servingsIds.length > 0) {
    constraints.push(where("servingsId", "in", filters.servingsIds));
  }

  switch (sort) {
    case "mostLiked":
      constraints.push(orderBy("likeCount", "desc"));
      break;
    case "mostSaved":
      constraints.push(orderBy("saveCount", "desc"));
      break;
    case "oldest":
      constraints.push(orderBy("createdAt", "asc"));
      break;
    case "newest":
    default:
      constraints.push(orderBy("createdAt", "desc"));
      break;
  }

  const q = query(recipesRef, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as RecipeFormData),
  })) as RecipeWithID[];
}

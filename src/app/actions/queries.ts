import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "@/store/firebase/config";
import { RecipeFormData, RecipeWithID, Category } from "@/types/recipes";
export async function getPublicRecipesFromFollowedUsers(followingIds: string[]) {
  if (followingIds.length === 0) return [];
  const q = query(
    collection(db, "recipes"),
    where("authorId", "in", followingIds),
    where("visibility", "==", "public"),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as RecipeFormData) }));
}

export async function getUserRecipes(userId: string) {
  const q = query(
    collection(db, "recipes"),
    where("authorId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as RecipeFormData) }));
}

export async function getPublicRecipes(): Promise<RecipeWithID[]> {
  const q = query(collection(db, "recipes"), where("visibility", "==", "public"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as RecipeFormData),
  }));
}

export async function getCategoriesByIds(ids: string[]): Promise<Category[]> {
  console.log("Fetching categories for IDs:", ids);

  try {
    const promises = ids.map(async (id) => {
      console.log(`Fetching category with id: ${id}`);
      const docRef = doc(db, "categories", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(`Category found for id ${id}:`, docSnap.data());
        return docSnap.data() as Category;
      } else {
        console.warn(`Category NOT found for id: ${id}`);
        return null;
      }
    });

    const categories = await Promise.all(promises);
    const filteredCategories = categories.filter((c): c is Category => c !== null);
    console.log("Fetched categories:", filteredCategories);
    return filteredCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
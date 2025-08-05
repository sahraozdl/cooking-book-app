import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase/config";
import { RecipeFormData, RecipeWithID, Category } from "@/types";

export async function getPublicRecipesFromFollowedUsers(followingIds: string[]) {
  if (followingIds.length === 0) return [];
  const q = query(
    collection(db, "recipes"),
    where("authorId", "in", followingIds),
    where("visibility", "==", "public"),
    where("isAnonymous", "==", false),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as RecipeFormData) }));
}

export async function getUserPublicRecipes(userId: string): Promise<RecipeWithID[]> {
  if (!userId) return [];

  const q = query(
    collection(db, "recipes"),
    where("authorId", "==", userId),
    where("visibility", "==", "public"),
    where("isAnonymous", "==", false),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as RecipeFormData),
  }));
}

export async function getRecipesFromUser(userId: string): Promise<RecipeWithID[]> {
  const q = query(collection(db, "recipes"), where("authorId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as RecipeFormData),
  })) as RecipeWithID[];
}

export async function getCategoriesByIds(ids: string[]): Promise<Category[]> {
  try {
    const promises = ids.map(async (id) => {
      const docRef = doc(db, "categories", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Category;
      } else {
        console.warn(`Category NOT found for id: ${id}`);
        return null;
      }
    });

    const categories = await Promise.all(promises);
    const filteredCategories = categories.filter((c): c is Category => c !== null);
    return filteredCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/app/lib/firebase/config";
export async function deleteRecipe(recipeId: string, userId: string) {
  const recipeRef = doc(db, "recipes", recipeId);
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const updatedWrites = (userData?.writes || []).filter((id: string) => id !== recipeId);
  const batch = writeBatch(db);
  batch.update(userRef, { writes: updatedWrites, writesCount: updatedWrites.length });
  batch.delete(recipeRef);
  await batch.commit();
}
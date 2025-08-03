import { doc, getDoc, writeBatch, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/store/firebase/config";

export async function toggleRecipeLike(recipeId: string, userId: string) {
  const recipeRef = doc(db, "recipes", recipeId);
  const userRef = doc(db, "users", userId);
  const batch = writeBatch(db);

  const recipeSnap = await getDoc(recipeRef);
  const userSnap = await getDoc(userRef);
  if (!recipeSnap.exists() || !userSnap.exists()) throw new Error("Recipe or user not found.");

  const recipeData = recipeSnap.data();
  const likedBy: string[] = recipeData.likedBy || [];
  const alreadyLiked = likedBy.includes(userId);

  if (alreadyLiked) {
    batch.update(recipeRef, {
      likedBy: arrayRemove(userId),
      likeCount: likedBy.length - 1,
    });
    batch.update(userRef, {
      likedRecipes: arrayRemove(recipeId),
    });
  } else {
    batch.update(recipeRef, {
      likedBy: arrayUnion(userId),
      likeCount: likedBy.length + 1,
    });
    batch.update(userRef, {
      likedRecipes: arrayUnion(recipeId),
    });
  }

  await batch.commit();
}

export async function toggleRecipeSave(recipeId: string, userId: string) {
  const recipeRef = doc(db, "recipes", recipeId);
  const userRef = doc(db, "users", userId);
  const batch = writeBatch(db);

  const recipeSnap = await getDoc(recipeRef);
  const userSnap = await getDoc(userRef);
  if (!recipeSnap.exists() || !userSnap.exists()) throw new Error("Recipe or user not found.");

  const recipeData = recipeSnap.data();
  const savedBy: string[] = recipeData.savedBy || [];
  const alreadySaved = savedBy.includes(userId);

  const saveCount = typeof recipeData.likeCount === "number" ? recipeData.saveCount : savedBy.length;

  if (alreadySaved) {
    batch.update(recipeRef, {
      savedBy: arrayRemove(userId),
      saveCount: Math.max(saveCount - 1, 0),
    });
    batch.update(userRef, {
      savedRecipes: arrayRemove(recipeId),
    });
  } else {
    batch.update(recipeRef, {
      savedBy: arrayUnion(userId),
      saveCount: saveCount + 1,
    });
    batch.update(userRef, {
      savedRecipes: arrayUnion(recipeId),
    });
  }

  await batch.commit();
}
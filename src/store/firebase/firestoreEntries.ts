import { db } from "./config";
import { addDoc, collection, serverTimestamp, query, where, getDocs, orderBy } from "firebase/firestore";
import { RecipeFormData } from "@/types/recipes";

type NewEntry = {
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  visibility: "public" | "private";
};

export async function addEntry(entry: NewEntry) {
  const entryWithMeta = {
    ...entry,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "entries"), entryWithMeta);
}

export async function getPublicEntriesFromFollowedUsers(followingIds: string[]) {
  if (followingIds.length === 0) return [];

  const q = query(
    collection(db, "entries"),
    where("authorId", "in", followingIds),
    where("visibility", "==", "public"),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<RecipeFormData, "id">;
    return {
      id: doc.id,
      ...data,
    };
  });
}

export async function getUserEntries(userId: string) {
  const q = query(
    collection(db, "entries"),
    where("authorId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<RecipeFormData, "id">;
    return {
      id: doc.id,
      ...data,
    };
  });
}

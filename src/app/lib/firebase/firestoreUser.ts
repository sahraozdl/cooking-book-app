import {
  collection,
  getDocs,
  query,
  where,
  QueryDocumentSnapshot,
  DocumentData,
  getDoc,
  writeBatch,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './config';
import { UserTypes } from '@/types';

export async function updateProfile(userId: string, updatedUserData: Partial<UserTypes>) {
  if (!userId) throw new Error('User ID is required');

  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, updatedUserData);
}

export const followUser = async (currentUserId: string, targetUserId: string) => {
  const batch = writeBatch(db);
  const currentRef = doc(db, 'users', currentUserId);
  const targetRef = doc(db, 'users', targetUserId);

  batch.update(currentRef, { following: arrayUnion(targetUserId) });
  batch.update(targetRef, { followers: arrayUnion(currentUserId) });

  await batch.commit();
};

export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
  const batch = writeBatch(db);
  const currentRef = doc(db, 'users', currentUserId);
  const targetRef = doc(db, 'users', targetUserId);

  batch.update(currentRef, { following: arrayRemove(targetUserId) });
  batch.update(targetRef, { followers: arrayRemove(currentUserId) });

  await batch.commit();
};

export async function getUserFollowers(userId: string) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return [];
  const data = userDoc.data();
  const followerIds: string[] = data?.followers || [];

  const followers = await Promise.all(
    followerIds.map(async (fid) => {
      const followerDoc = await getDoc(doc(db, 'users', fid));
      if (!followerDoc.exists()) return null;
      return { id: fid, ...followerDoc.data() } as UserTypes;
    })
  );
  return followers.filter(Boolean) as UserTypes[];
}

export async function getUserFollowing(userId: string) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return [];
  const data = userDoc.data();
  const followingIds: string[] = data?.following || [];

  const following = await Promise.all(
    followingIds.map(async (fid) => {
      const followedDoc = await getDoc(doc(db, 'users', fid));
      if (!followedDoc.exists()) return null;
      return { id: fid, ...followedDoc.data() } as UserTypes;
    })
  );
  return following.filter(Boolean) as UserTypes[];
}

export async function searchUsersByName(queryString: string) {
  const q = query(
    collection(db, 'users'),
    where('name', '>=', queryString),
    where('name', '<=', queryString + '\uf8ff')
  );
  const results = await getDocs(q);
  return results.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getUserById(userId: string) {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { UserTypes } from "@/types/recipes";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/store/firebase/config";

interface IUserContext {
  user: UserTypes | null;
  loading: boolean;
  errors: UserTypes["errors"] | null;
  setError: React.Dispatch<React.SetStateAction<UserTypes["errors"] | null>>;
  setUser: React.Dispatch<React.SetStateAction<UserTypes | null>>;
}

const UserContext = createContext<IUserContext>({
  user: null,
  loading: true,
  errors: null,
  setError: () => {},
  setUser: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setError] = useState<UserTypes["errors"] | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email ?? undefined,
            name: userData.name ?? firebaseUser.displayName ?? undefined,
            photoURL: firebaseUser.photoURL ?? undefined,
            createdAt: userData.createdAt?.toDate() ?? undefined,
            writes: userData.writes ?? [],
            writesCount: userData.writesCount ?? 0,
            following: userData.following ?? [],
          });
        } else {
          setUser(null);
        }
        setLoading(false);
        setError(null);
      },
      (firebaseError) => {
        console.error("Firebase auth error:", firebaseError);
        setError({
          email: [firebaseError.message],
          name: undefined,
          password: undefined,
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, errors, setError, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

"use client";

import Link from "next/link";
import NavbarFilters from "./NavbarFilters";
import { db } from "@/app/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { signOutUser } from "@/app/lib/firebase/auth";
import { Category, Cuisine, Difficulty, Serving } from "@/types";
import ProtectedContent from "./ProtectedContent";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [servings, setServings] = useState<Serving[]>([]);

  const isExcludedPath = (path: string) =>
    path === "/profile" ||
    path === "/login" ||
    path === "/recipes/new" ||
    path.startsWith("/recipes/categories");
  const showFilters = !isExcludedPath(pathname);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchFilters() {
      const categoriesSnapshot = await getDocs(collection(db, "categories"));
      const cuisinesSnapshot = await getDocs(collection(db, "cuisines"));
      const difficultiesSnapshot = await getDocs(
        collection(db, "difficulties")
      );
      const servingsSnapshot = await getDocs(collection(db, "servings"));

      setCategories(
        categoriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setCuisines(
        cuisinesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setDifficulties(
        difficultiesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setServings(
        servingsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    }

    fetchFilters();
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex justify-between items-center w-full md:w-auto">
          <h1 className="text-white text-xl">Cooking Book App</h1>
          <ul className="flex space-x-4 ml-6">
            <li>
              <Link href="/" className="text-white hover:underline">
                Home
              </Link>
            </li>
            <li>
              <ProtectedContent>
                <Link href="/dashboard" className="text-white hover:underline">
                  Dashboard
                </Link>
              </ProtectedContent>
            </li>
            <li>
              <ProtectedContent>
                <Link
                  href="/recipes/new"
                  className="text-white hover:underline"
                >
                  New Recipe
                </Link>
              </ProtectedContent>
            </li>
            <li>
              <Link
                href="/recipes/categories"
                className="text-white hover:underline"
              >
                Categories
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <ProtectedContent>
                    <Link
                      href="/profile"
                      className="text-white hover:underline"
                    >
                      Profile
                    </Link>
                  </ProtectedContent>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:underline"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="text-white hover:underline">
                  Login
                </Link>
              </li>
            )}
            {showFilters && (
              <li>
                <NavbarFilters
                  categories={categories}
                  cuisines={cuisines}
                  difficulties={difficulties}
                  servings={servings}
                />
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

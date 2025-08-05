"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {  useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { signOutUser } from "@/app/lib/firebase/auth";

import ProtectedContent from "./ProtectedContent";

export const Navbar = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
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
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

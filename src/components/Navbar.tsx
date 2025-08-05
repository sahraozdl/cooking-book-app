"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOutUser } from "@/app/lib/firebase/auth";
import ProtectedContent from "./ProtectedContent";
import { useUser } from "@/store/UserContext";
import {DotsThreeIcon, XIcon,ChefHatIcon} from "@phosphor-icons/react"

export const Navbar = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    router.push("/");
  };

  const navLinks = (
    <>
      <li>
        <Link href="/" className="hover:underline">
          Home
        </Link>
      </li>
      <ProtectedContent>
        <li>
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </li>
      </ProtectedContent>
      <ProtectedContent>
        <li>
          <Link href="/recipes/new" className="hover:underline">
            New Recipe
          </Link>
        </li>
      </ProtectedContent>
      <li>
        <Link href="/recipes/categories" className="hover:underline">
          Categories
        </Link>
      </li>
      {user ? (
        <>
          <ProtectedContent>
            <li>
              <Link href="/profile" className="hover:underline">
                Profile
              </Link>
            </li>
          </ProtectedContent>
          <li>
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          </li>
        </>
      ) : (
        <li>
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        </li>
      )}
    </>
  );

  return (
    <nav className="bg-orange-300 text-red-950 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold"><ChefHatIcon size={32} weight="bold" className="inline"/> Cooking Book App</h1>

        {/* Desktop nav */}
        <ul className="hidden md:flex space-x-6 text-sm items-center">
          {navLinks}
        </ul>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-orange-700"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <XIcon size={32} /> : <DotsThreeIcon size={32} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <ul className="md:hidden px-6 pb-4 space-y-3 text-sm">
          {navLinks}
        </ul>
      )}
    </nav>
  );
};

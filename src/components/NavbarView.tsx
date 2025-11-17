'use client';

import Link from 'next/link';
import { DotsThreeIcon, XIcon, ChefHatIcon } from '@phosphor-icons/react';
import React from 'react';
import { UserTypes } from '@/types';

interface NavbarViewProps {
  user: UserTypes | null;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onLogout: () => void;
}

export const NavbarView = ({ user, isMenuOpen, onToggleMenu, onLogout }: NavbarViewProps) => {
  const navLinks = (
    <>
      <li>
        <Link href="/" className="hover:underline">
          Home
        </Link>
      </li>
      {user && (
        <>
          <li>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/recipes/new" className="hover:underline">
              New Recipe
            </Link>
          </li>
        </>
      )}
      <li>
        <Link href="/recipes/categories" className="hover:underline">
          Categories
        </Link>
      </li>
      {user ? (
        <>
          <li>
            <Link href="/profile" className="hover:underline">
              Profile
            </Link>
          </li>
          <li>
            <button onClick={onLogout} className="hover:underline">
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
    <nav className="bg-accent text-foreground shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold">
          <ChefHatIcon size={32} weight="bold" className="inline" /> Cooking Book App
        </h1>

        <ul className="hidden md:flex space-x-6 text-sm items-center">{navLinks}</ul>

        <button
          onClick={onToggleMenu}
          className="md:hidden text-orange-700"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <XIcon size={32} /> : <DotsThreeIcon size={32} />}
        </button>
      </div>

      {isMenuOpen && <ul className="md:hidden px-6 pb-4 space-y-3 text-sm">{navLinks}</ul>}
    </nav>
  );
};

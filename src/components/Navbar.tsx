'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOutUser } from '@/app/lib/firebase/auth';
import { useUser } from '@/store/UserContext';
import { NavbarView } from './NavbarView';

export const Navbar = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    router.push('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <NavbarView
      user={user}
      isMenuOpen={isMenuOpen}
      onToggleMenu={toggleMenu}
      onLogout={handleLogout}
    />
  );
};

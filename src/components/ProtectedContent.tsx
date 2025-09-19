'use client';

import React, { ReactNode } from 'react';
import { useUser } from '../store/UserContext';

export default function ProtectedContent({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();

  if (loading || !user?.email) return null;

  return <>{children}</>;
}

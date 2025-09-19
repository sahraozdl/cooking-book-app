'use client';

import { FireIcon } from '@phosphor-icons/react';
import React from 'react';

const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <FireIcon size={64} weight="fill" className="w-16 h-16 text-orange-500 animate-bounce" />
      <p className="mt-4 text-lg text-gray-700">Firing up the kitchen...</p>
    </div>
  );
};

export default FullPageLoader;

'use client';

import { Button } from '@headlessui/react';
import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function SecondaryButton({ children, className, ...props }: Props) {
  return (
    <Button
      {...props}
      className={clsx(
        'px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-orange-300 transition bg-gray-200 cursor-pointer focus:outline-orange-500',
        className
      )}
    >
      {children}
    </Button>
  );
}

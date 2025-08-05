"use client";

import { Button } from "@headlessui/react";
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function PrimaryButton({ children, className, ...props }: Props) {
  return (
    <Button
      {...props}
      className={clsx(
        "px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition disabled:opacity-50 cursor-pointer focus:outline-orange-800",
        className
      )}
    >
      {children}
    </Button>
  );
}

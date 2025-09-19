import React from 'react';

interface ActionIconButtonProps {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  active?: boolean;
  className?: string;
  count?: number;
}

export default function ActionIconButton({
  onClick,
  label,
  icon,
  activeIcon,
  active = false,
  count,
  className = '',
}: ActionIconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center text-sm gap-1 transition focus:outline-orange-500 focus:ring-2 focus:ring-orange-400 rounded-full px-2 py-1 hover:animate-pulse cursor-pointer hover:scale-125
        ${active ? 'text-orange-600 bg-orange-200' : 'text-gray-400 border border-orange-300'} ${className}`}
      aria-label={label}
    >
      <span className="text-lg">{active ? (activeIcon ?? icon) : icon}</span>
      <span className="text-xs">{count}</span>
    </button>
  );
}

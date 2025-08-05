"use client";

import React, { ReactNode } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function EditModal({
  isOpen,
  onClose,
  title = "Edit",
  children,
}: EditModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />

      {/* Modal wrapper */}
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <DialogPanel className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-orange-600 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
            aria-label="Close modal"
          >
            ×
          </button>

          {/* Modal title */}
          <DialogTitle className="text-xl font-semibold text-orange-600 mb-4">
            {title}
          </DialogTitle>

          {/* Modal content */}
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

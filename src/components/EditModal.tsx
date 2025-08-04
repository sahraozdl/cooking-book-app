import React, { ReactNode } from "react";
import { Dialog,DialogPanel,DialogTitle } from "@headlessui/react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function EditModal({ isOpen, onClose, title = "Edit", children }: EditModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="fixed inset-0 bg-black bg-opacity-10" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center overflow-y-scroll">
        <DialogPanel className="bg-gray-800 p-6 rounded-xl max-w-lg w-full shadow-xl">
          <DialogTitle className="text-lg font-bold mb-4">{title}</DialogTitle>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

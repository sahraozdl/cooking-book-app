"use client";

import { useState } from "react";
import { updateProfile } from "@/store/firebase/firestoreUser";
import { UserTypes } from "@/types/recipes";
import { useUser } from "@/components/UserContext";

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserTypes;
}) {
  const [name, setName] = useState(user.name ?? "");

  const { setUser } = useUser();

  const handleUpdate = async () => {
    if (!user.id) throw new Error("User ID is required");
    await updateProfile(user.id, { name });
    setUser((prev) => (prev ? { ...prev, name } : prev));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-black p-6 rounded shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        <label className="block mb-2">
          Name
          <input
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleUpdate} className="btn">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { UserTypes } from "@/types/recipes";

interface Props {
  user: UserTypes;
  onClose: () => void;
}

export default function ProfileForm({ user, onClose }: Props) {
  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call Firestore update for user
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">Save</button>
      </div>
    </form>
  );
}

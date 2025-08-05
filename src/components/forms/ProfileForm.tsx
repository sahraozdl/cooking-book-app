"use client";

import React, { useEffect } from "react";
import { useActionState } from "react";
import { updateProfileAction } from "@/app/actions/updateProfileAction";
import { UserTypes } from "@/types";

interface Props {
  user: UserTypes;
  onClose: () => void;
  onSuccess?: () => void; // Optional callback to refresh UI
}

type ProfileFormState = {
  success: boolean;
  message: string;
};

const initialState: ProfileFormState = { success: false, message: "" };

export default function ProfileForm({ user, onClose, onSuccess }: Props) {
  const [state, action, isPending] = useActionState<ProfileFormState, FormData>(
    updateProfileAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
      onClose();
    }
  }, [state.success, onSuccess, onClose]);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="userId" value={user.id} />
      <input
        type="text"
        name="name"
        defaultValue={user.name}
        className="input"
      />
      <input
        type="email"
        name="email"
        defaultValue={user.email}
        className="input"
      />

      {state.message && (
        <p
          className={`text-sm ${
            state.success ? "text-green-500" : "text-red-500"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

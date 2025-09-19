'use client';

import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { updateProfileAction } from '@/app/actions/updateProfileAction';
import { UserTypes } from '@/types';
import { Field, Label, Input, Description } from '@headlessui/react';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';

interface Props {
  user: UserTypes;
  onClose: () => void;
  onSuccess?: () => void;
}

type ProfileFormState = {
  success: boolean;
  message: string;
};

const initialState: ProfileFormState = { success: false, message: '' };

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
    <form action={action} className="text-left max-w-xl mx-auto p-4 space-y-4">
      <input type="hidden" name="userId" value={user.id} />

      <Field className="flex flex-col gap-1">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={user.name}
          required
          aria-describedby="name-help"
          className="border border-orange-300 rounded px-3 py-2 text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <Description id="name-help" className="text-xs text-gray-500">
          Your full name as displayed in your profile.
        </Description>
      </Field>

      <Field className="flex flex-col gap-1">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={user.email}
          required
          aria-describedby="email-help"
          className="border border-orange-300 rounded px-3 py-2 text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <Description id="email-help" className="text-xs text-gray-500">
          Used for login and communication.
        </Description>
      </Field>

      {state.message && (
        <p
          role="status"
          className={`text-sm mt-1 ${state.success ? 'text-green-600' : 'text-red-500'}`}
        >
          {state.message}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <SecondaryButton type="button" onClick={onClose}>
          Cancel
        </SecondaryButton>
        <PrimaryButton type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </PrimaryButton>
      </div>
    </form>
  );
}

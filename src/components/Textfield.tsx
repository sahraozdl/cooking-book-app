"use client";

import { Field, Input, Label, Textarea } from "@headlessui/react";

function Textfield({
  label,
  id,
  name,
  placeholder,
  defaultValue,
  error,
  type = "text",
  multiline = false,
}: {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string[];
  type?: string;
  multiline?: boolean;
}) {
  return (
    <Field className="flex flex-col my-4 text-black">
      <Label
        htmlFor={id}
        className="mb-1 text-sm font-semibold text-orange-700"
      >
        {label}
      </Label>
      {multiline ? (
        <Textarea
          id={id}
          name={name}
          placeholder={placeholder}
          aria-describedby={`${id}-error`}
          defaultValue={defaultValue}
          rows={5}
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition bg-white ${
            error ? "border-red-500" : "border-orange-300"
          }`}
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          aria-describedby={`${id}-error`}
          defaultValue={defaultValue}
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition bg-white ${
            error ? "border-red-500" : "border-orange-300"
          }`}
        />
      )}
      {error && (
        <span id={`${id}-error`} className="text-red-600 text-sm mt-1">
          {error.join(", ")}
        </span>
      )}
    </Field>
  );
}

export default Textfield;

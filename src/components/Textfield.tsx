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
    <Field className="flex flex-col my-4">
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea
          id={id}
          name={name}
          placeholder={placeholder}
          aria-describedby={`${id}-error`}
          defaultValue={defaultValue}
          className={`border rounded p-2 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          rows={5}
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          aria-describedby={`${id}-error`}
          defaultValue={defaultValue}
          className={`border rounded p-2 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      )}
      {error && (
        <span id={`${id}-error`} className="text-red-500 text-sm">
          {error}
        </span>
      )}
    </Field>
  );
}
export default Textfield;

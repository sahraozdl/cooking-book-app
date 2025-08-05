"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Field,
  Label,
} from "@headlessui/react";
import { Fragment } from "react";

export type Option = { id: string; name: string };
type DropdownProps<T extends boolean = false> = {
  label: string;
  options: Option[];
  selected: T extends true ? Option[] : Option | null;
  setSelected: (val: T extends true ? Option[] : Option | null) => void;
  name: string;
  multiple?: T;
};

export default function Dropdown<T extends boolean = false>({
  label,
  options,
  selected,
  setSelected,
  multiple = false as T,
}: DropdownProps<T>) {
  const isSelected = (option: Option) => {
    if (multiple && Array.isArray(selected)) {
      return selected.some((item) => item.id === option.id);
    }
    return (selected as Option)?.id === option.id;
  };

  const removeItem = (id: string) => {
    if (multiple && Array.isArray(selected)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSelected(selected.filter((item) => item.id !== id) as any);
    }
  };

  return (
    <Field className="flex flex-col my-4">
      <Label className="mb-1 text-sm font-medium">{label}</Label>
      <Listbox value={selected} onChange={setSelected} multiple={multiple}>
        <div className="relative">
          <ListboxButton className="border p-2 rounded bg-black w-full text-left text-white min-h-[42px] flex flex-wrap gap-2">
            {multiple && Array.isArray(selected) && selected.length > 0 ? (
              selected.map((item) => (
                <span
                  key={item.id}
                  className="bg-gray-800 px-2 py-1 rounded text-sm flex items-center gap-3"
                >
                  {item.name}
                  <span
                    role="button"
                    tabIndex={0}
                    className="text-red-400 hover:text-red-600 cursor-pointer text-2xl select-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        removeItem(item.id);
                      }
                    }}
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </span>
                </span>
              ))
            ) : (
              <span>
                {!selected ? `Select ${label}` : (selected as Option).name}
              </span>
            )}
          </ListboxButton>

          <ListboxOptions className="absolute z-10 mt-1 w-full border bg-black rounded shadow-lg max-h-40 overflow-auto text-white">
            {options.map((option) =>  (
                <ListboxOption key={option.id} value={option} as={Fragment}>
                  {({ active }) => (
                    <li
                      className={`cursor-pointer px-4 py-2 ${
                        isSelected(option) ? "bg-blue-900 font-semibold" : ""
                      } ${active ? "bg-gray-900" : ""}`}
                    >
                      {option.name}
                    </li>
                  )}
                </ListboxOption>
              ))
            }
          </ListboxOptions>
        </div>
      </Listbox>

      
    </Field>
  );
}

'use client';

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Field,
  Label,
} from '@headlessui/react';
import { Fragment } from 'react';

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
      <Label className="mb-1 text-sm font-semibold text-orange-700">{label}</Label>
      <Listbox value={selected} onChange={setSelected} multiple={multiple}>
        <div className="relative">
          <ListboxButton className="border border-orange-300 p-2 rounded bg-white w-full text-left text-gray-900 min-h-[42px] flex flex-wrap gap-2 hover:ring-2 hover:ring-orange-400 transition focus:outline-orange-400">
            {multiple && Array.isArray(selected) && selected.length > 0 ? (
              selected.map((item) => (
                <span
                  key={item.id}
                  className="bg-orange-400 text-black px-2 py-1 rounded text-sm flex items-center gap-3 select-none hover:bg-orange-600"
                >
                  {item.name}
                  <span
                    role="button"
                    tabIndex={0}
                    className="text-red-700 hover:text-red-900 cursor-pointer text-lg select-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
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
              <span className="text-gray-800 italic">
                {!selected ? `Select ${label}` : (selected as Option).name}
              </span>
            )}
          </ListboxButton>

          <ListboxOptions className="absolute z-10 mt-1 w-full border border-orange-300 bg-white rounded shadow-lg max-h-40 overflow-auto text-gray-900">
            {options.map((option) => (
              <ListboxOption key={option.id} value={option} as={Fragment}>
                {({ active }) => (
                  <li
                    className={`cursor-pointer px-4 py-2 ${
                      isSelected(option) ? 'bg-orange-300 font-semibold' : ''
                    } ${active ? 'bg-orange-100' : ''}`}
                  >
                    {option.name}
                  </li>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </Field>
  );
}

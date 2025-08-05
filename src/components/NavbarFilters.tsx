"use client";

import {
  Menu,
  MenuButton,
  MenuItems,
  Transition,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Fragment, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface FilterOption {
  id: string;
  name?: string;
}

export interface NavbarFiltersProps {
  categories: FilterOption[];
  cuisines: FilterOption[];
  difficulties: FilterOption[];
  servings: FilterOption[];
}

const sortOptions = [
  { id: "newest", name: "Newest" },
  { id: "oldest", name: "Oldest" },
  { id: "mostLiked", name: "Most Liked" },
  { id: "mostSaved", name: "Most Saved" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NavbarFilters({
  categories,
  cuisines,
  difficulties,
  servings,
}: NavbarFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSort = searchParams.get("sort") || "newest";
  const [selectedSort, setSelectedSort] = useState(initialSort);

  const getMultiParam = (key: string) => {
    const value = searchParams.get(key);
    return value ? value.split(",") : [];
  };

  const [selectedCategories, setSelectedCategories] = useState(
    getMultiParam("categories")
  );
  const [selectedCuisines, setSelectedCuisines] = useState(
    getMultiParam("cuisineId")
  );
  const [selectedDifficulties, setSelectedDifficulties] = useState(
    getMultiParam("difficultyId")
  );
  const [selectedServings, setSelectedServings] = useState(
    getMultiParam("servingsId")
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0)
      params.set("categories", selectedCategories.join(","));
    if (selectedCuisines.length > 0)
      params.set("cuisineId", selectedCuisines.join(","));
    if (selectedDifficulties.length > 0)
      params.set("difficultyId", selectedDifficulties.join(","));
    if (selectedServings.length > 0)
      params.set("servingsId", selectedServings.join(","));
    if (selectedSort) params.set("sort", selectedSort);

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [
    selectedCategories,
    selectedCuisines,
    selectedDifficulties,
    selectedServings,
    selectedSort,
    router,
  ]);

  const toggleValue = (
    value: string,
    setState: (val: string[]) => void,
    state: string[]
  ) => {
    setState(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedCuisines([]);
    setSelectedDifficulties([]);
    setSelectedServings([]);
    setSelectedSort("newest");
  };

  const renderCheckboxGroup = (
    title: string,
    options: FilterOption[],
    selected: string[],
    setSelected: (val: string[]) => void
  ) => (
    <Disclosure as="div" className="border-b border-gray-300 py-2">
      <>
        <DisclosureButton className="flex w-full justify-between text-sm font-medium text-gray-800 dark:text-white">
          <span>{title}</span>
          <ChevronDownIcon className={classNames("h-5 w-5")} />
        </DisclosureButton>
        <DisclosurePanel className="mt-2 space-y-2">
          {options.map((opt) => (
            <label key={opt.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selected.includes(opt.id)}
                onChange={() => toggleValue(opt.id, setSelected, selected)}
                className="accent-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-200">
                {opt.name}
              </span>
            </label>
          ))}
        </DisclosurePanel>
      </>
    </Disclosure>
  );

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Filters
          <ChevronDownIcon className="ml-2 h-5 w-5" />
        </MenuButton>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <MenuItems className="absolute z-50 mt-2 w-80 max-h-[90vh] overflow-y-auto origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Filters
            </h2>
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:underline dark:text-red-400"
            >
              Clear
            </button>
          </div>

          {renderCheckboxGroup(
            "Categories",
            categories,
            selectedCategories,
            setSelectedCategories
          )}
          {renderCheckboxGroup(
            "Cuisines",
            cuisines,
            selectedCuisines,
            setSelectedCuisines
          )}
          {renderCheckboxGroup(
            "Difficulties",
            difficulties,
            selectedDifficulties,
            setSelectedDifficulties
          )}
          {renderCheckboxGroup(
            "Servings",
            servings,
            selectedServings,
            setSelectedServings
          )}

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Sort by
            </label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}

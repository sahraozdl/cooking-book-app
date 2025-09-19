'use client';

import {
  Menu,
  MenuButton,
  MenuItems,
  Transition,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ArrowDownIcon } from '@phosphor-icons/react';
import { Fragment, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
  { id: 'newest', name: 'Newest' },
  { id: 'oldest', name: 'Oldest' },
  { id: 'mostLiked', name: 'Most Liked' },
  { id: 'mostSaved', name: 'Most Saved' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function NavbarFilters({
  categories,
  cuisines,
  difficulties,
  servings,
}: NavbarFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSort = searchParams.get('sort') || 'newest';
  const [selectedSort, setSelectedSort] = useState(initialSort);

  const getMultiParam = (key: string) => {
    const value = searchParams.get(key);
    return value ? value.split(',') : [];
  };

  const [selectedCategories, setSelectedCategories] = useState(getMultiParam('categories'));
  const [selectedCuisines, setSelectedCuisines] = useState(getMultiParam('cuisineId'));
  const [selectedDifficulties, setSelectedDifficulties] = useState(getMultiParam('difficultyId'));
  const [selectedServings, setSelectedServings] = useState(getMultiParam('servingsId'));

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    if (selectedCuisines.length > 0) params.set('cuisineId', selectedCuisines.join(','));
    if (selectedDifficulties.length > 0) params.set('difficultyId', selectedDifficulties.join(','));
    if (selectedServings.length > 0) params.set('servingsId', selectedServings.join(','));
    if (selectedSort) params.set('sort', selectedSort);

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [
    selectedCategories,
    selectedCuisines,
    selectedDifficulties,
    selectedServings,
    selectedSort,
    router,
  ]);

  const toggleValue = (value: string, setState: (val: string[]) => void, state: string[]) => {
    setState(state.includes(value) ? state.filter((v) => v !== value) : [...state, value]);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedCuisines([]);
    setSelectedDifficulties([]);
    setSelectedServings([]);
    setSelectedSort('newest');
  };

  const renderCheckboxGroup = (
    title: string,
    options: FilterOption[],
    selected: string[],
    setSelected: (val: string[]) => void
  ) => (
    <Disclosure as="div" className="border-b border-gray-300 py-2">
      {({ open }) => (
        <>
          <DisclosureButton className="flex w-full justify-between text-sm font-medium text-gray-800 ">
            <span>{title}</span>
            <ArrowDownIcon
              className={classNames(
                'h-5 w-5 transition-transform',
                open ? 'rotate-180 transform' : ''
              )}
            />
          </DisclosureButton>
          <DisclosurePanel className="mt-2 space-y-2 max-h-48 overflow-auto">
            {options.map((opt) => (
              <label key={opt.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selected.includes(opt.id)}
                  onChange={() => toggleValue(opt.id, setSelected, selected)}
                  className="accent-orange-500"
                />
                <span className="text-sm text-gray-700 ">{opt.name}</span>
              </label>
            ))}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );

  return (
    <div className="w-full max-w-xs md:max-w-none md:w-64 p-2 bg-orange-50 rounded-md shadow-sm">
      <Menu as="div" className="relative text-left w-full">
        <div>
          <MenuButton className="inline-flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-red-900 bg-orange-300 rounded-md hover:bg-orange-400 focus:outline-none focus:ring focus:ring-orange-500 focus:ring-offset-2 cursor-pointer">
            Filters
            <ArrowDownIcon className="ml-2 h-5 w-5" />
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
          <MenuItems className="absolute z-50 mt-2 w-full max-h-[90vh] overflow-y-auto origin-top-left divide-y divide-gray-100 rounded-md bg-orange-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 ">Filters</h2>
              <button onClick={clearFilters} className="text-sm text-red-600 hover:underline ">
                Clear
              </button>
            </div>

            {renderCheckboxGroup(
              'Categories',
              categories,
              selectedCategories,
              setSelectedCategories
            )}
            {renderCheckboxGroup('Cuisines', cuisines, selectedCuisines, setSelectedCuisines)}
            {renderCheckboxGroup(
              'Difficulties',
              difficulties,
              selectedDifficulties,
              setSelectedDifficulties
            )}
            {renderCheckboxGroup('Servings', servings, selectedServings, setSelectedServings)}

            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 ">Sort by</label>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 bg-white  text-gray-900 py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
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
    </div>
  );
}

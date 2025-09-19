import { getStaticOptions } from './config';
import { FilterOption } from '@/components/NavbarFilters';

export async function getAllCategories(): Promise<FilterOption[]> {
  return getStaticOptions<FilterOption>('categories');
}

export async function getAllCuisines(): Promise<FilterOption[]> {
  return getStaticOptions<FilterOption>('cuisines');
}

export async function getAllDifficulties(): Promise<FilterOption[]> {
  return getStaticOptions<FilterOption>('difficulties');
}

export async function getAllServings(): Promise<FilterOption[]> {
  return getStaticOptions<FilterOption>('servings');
}

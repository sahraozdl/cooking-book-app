import { getDocs, query, where, orderBy } from 'firebase/firestore';
import { RecipeFormData, RecipeWithID } from '@/types';
import { recipesCollectionRef } from '@/app/lib/firebase/config';
import { QueryConstraint } from 'firebase/firestore';

export async function getFilteredSortedRecipesFromParams(searchParams: URLSearchParams) {
  const sort = searchParams.get('sort') || 'newest';

  const filters = {
    categories: searchParams.get('categories')?.split(',').filter(Boolean),
    cuisineId: searchParams.get('cuisineId')?.split(',').filter(Boolean),
    difficultyId: searchParams.get('difficultyId')?.split(',').filter(Boolean),
    servingsId: searchParams.get('servingsId')?.split(',').filter(Boolean),
  };
  console.log(filters);
  const constraints: QueryConstraint[] = [];
  console.log(constraints);
  if (filters.categories?.length) {
    constraints.push(where('categoryIds', 'array-contains-any', filters.categories));
  }

  if (filters.cuisineId?.length) {
    constraints.push(where('cuisineId.id', 'in', filters.cuisineId));
  }

  if (filters.difficultyId?.length) {
    constraints.push(where('difficultyId.id', 'in', filters.difficultyId));
  }

  if (filters.servingsId?.length) {
    constraints.push(where('servingsId.id', 'in', filters.servingsId));
  }
  console.log(constraints);
  switch (sort) {
    case 'mostLiked':
      constraints.push(orderBy('likeCount', 'desc'));
      break;
    case 'mostSaved':
      constraints.push(orderBy('saveCount', 'desc'));
      break;
    case 'oldest':
      constraints.push(orderBy('createdAt', 'asc'));
      break;
    case 'newest':
    default:
      constraints.push(orderBy('createdAt', 'desc'));
      break;
  }

  const q = query(recipesCollectionRef, ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as RecipeFormData),
  })) as RecipeWithID[];
}

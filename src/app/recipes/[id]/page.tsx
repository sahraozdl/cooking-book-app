import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/config';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Category, Cuisine, Difficulty, RecipeWithID } from '@/types';
import { getCategoriesByIds } from '@/app/actions/firestoreRecipeActions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function RecipeDetailsPage({ params }:any) {
  // Unwrap params safely
  const { id } = await params as { id: string };

  const recipeRef = doc(db, 'recipes', id);
  const recipeSnap = await getDoc(recipeRef);
  if (!recipeSnap.exists()) return notFound();

  const recipe = {
    id: recipeSnap.id,
    ...recipeSnap.data(),
  } as RecipeWithID;

  const getId = (val?: string | { id?: string }) => (typeof val === 'string' ? val : val?.id);

  let difficulty: Difficulty | null = null;
  const difficultyId = getId(recipe.difficultyId);
  if (difficultyId) {
    const diffSnap = await getDoc(doc(db, 'difficulties', difficultyId));
    if (diffSnap.exists()) {
      difficulty = { id: diffSnap.id, ...diffSnap.data() } as Difficulty;
    }
  }

  let cuisine: Cuisine | null = null;
  const cuisineId = getId(recipe.cuisineId);
  if (cuisineId) {
    const cuisineSnap = await getDoc(doc(db, 'cuisines', cuisineId));
    if (cuisineSnap.exists()) {
      cuisine = { id: cuisineSnap.id, ...cuisineSnap.data() } as Cuisine;
    }
  }

  let categories: Category[] = [];
  if (Array.isArray(recipe.categories) && recipe.categories.length > 0) {
    const categoryIds = recipe.categories.map((cat) => getId(cat) ?? '');
    categories = await getCategoriesByIds(categoryIds.filter(Boolean));
  }

  return (
    <article className="p-4 max-w-4xl mx-auto space-y-6 text-gray-800">
      <h1 className="text-2xl sm:text-3xl font-bold break-words">{recipe.strMeal}</h1>

      <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0 text-sm">
        {difficulty && (
          <p>
            <strong>Difficulty:</strong> {difficulty.name} ({difficulty.avgTime})
          </p>
        )}

        {cuisine && (
          <p>
            <strong>Cuisine:</strong> {cuisine.name} ({cuisine.region})
          </p>
        )}

        {categories.length > 0 && (
          <p>
            <strong>Categories:</strong> {categories.map((cat) => cat.name).join(', ')}
          </p>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="w-full md:w-1/2 max-w-xs md:max-w-full mx-auto mb-2 md:mb-0">
          {recipe.strMealThumb ? (
            <Image
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              width={300}
              height={300}
              className="rounded object-cover"
              priority
            />
          ) : (
            <div className="bg-gray-200 rounded w-full aspect-square" />
          )}
        </div>

        <section className="whitespace-pre-line leading-relaxed text-sm sm:text-base md:w-1/2">
          {recipe.strInstructions}
        </section>
      </div>

      {recipe.ingredients?.length > 0 && (
        <section>
          <h2 className="font-semibold mt-6 mb-2 text-lg">Ingredients:</h2>
          <ul className="list-disc list-inside ml-5 space-y-1 text-sm sm:text-base">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx}>
                {ing.strIngredient} — {ing.strMeasure}
              </li>
            ))}
          </ul>
        </section>
      )}

      {recipe.authorName && (
        <p className="mt-6 text-sm sm:text-base text-gray-700">
          <strong>Author:</strong> {recipe.isAnonymous ? 'Anonymous' : recipe.authorName}
        </p>
      )}
    </article>
  );
}

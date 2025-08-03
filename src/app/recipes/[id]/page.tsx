import { getDoc, doc } from "firebase/firestore";
import { db } from "@/store/firebase/config";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RecipeFormData, Category, Difficulty, Cuisine } from "@/types/recipes";
import { getCategoriesByIds } from "@/app/actions/firestoreRecipeActions";

export default async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const docRef = doc(db, "recipes", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return notFound();

  const recipeRef = doc(db, "recipes", id);
  const recipeSnap = await getDoc(recipeRef);
  if (!recipeSnap.exists()) return notFound();
  const recipe = recipeSnap.data() as RecipeFormData;

  let difficulty = null;
  if (recipe.difficultyId) {
    const difficultyRef = doc(db, "difficulties", recipe.difficultyId);
    const difficultySnap = await getDoc(difficultyRef);
    if (difficultySnap.exists()) {
      difficulty = difficultySnap.data() as Difficulty;
    }
  }

  let cuisine = null;
  if (recipe.cuisineId) {
    const cuisineRef = doc(db, "cuisines", recipe.cuisineId);
    const cuisineSnap = await getDoc(cuisineRef);
    if (cuisineSnap.exists()) {
      cuisine = cuisineSnap.data() as Cuisine;
    }
  }

  let categories: Category[] = [];
  if (recipe.categories && recipe.categories.length > 0) {
    categories = await getCategoriesByIds(recipe.categories);
  }

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{recipe.strMeal}</h1>
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
        <div>
          <strong>Categories:</strong>
          <ul>
            {categories.map((cat) => (
              <li key={cat.id}>{cat.name}</li>
            ))}
          </ul>
        </div>
      )}
      {recipe.strMealThumb && (
        <Image
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          width={200}
          height={200}
          className="rounded"
        />
      )}

      <p className="text-gray-700 whitespace-pre-line">
        {recipe.strInstructions}
      </p>

      {recipe.ingredients && (
        <div>
          <h2 className="font-semibold mt-4">Ingredients:</h2>
          <ul>
            {recipe.ingredients?.map((ing, idx) => (
              <li key={idx}>
                {ing.strIngredient} — {ing.strMeasure}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recipe.authorName && (
        <p>
          <strong>Author:</strong>{" "}
          {recipe.isAnonymous ? "Anonymous" : recipe.authorName}
        </p>
      )}
    </div>
  );
}

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase/config";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Category, Cuisine, Difficulty, RecipeWithID } from "@/types";
import { getCategoriesByIds } from "@/app/actions/firestoreRecipeActions";

export default async function RecipeDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // Fetch main recipe
  const recipeRef = doc(db, "recipes", id);
  const recipeSnap = await getDoc(recipeRef);
  if (!recipeSnap.exists()) return notFound();

  const recipe = {
    id: recipeSnap.id,
    ...recipeSnap.data(),
  } as RecipeWithID;

  // Fetch difficulty (if present)
  let difficulty: Difficulty | null = null;
  const difficultyId =
    typeof recipe.difficultyId === "string"
      ? recipe.difficultyId
      : recipe.difficultyId?.id; // or undefined

  if (difficultyId) {
    const snap = await getDoc(doc(db, "difficulties", difficultyId));
    if (snap.exists()) {
      difficulty = { id: snap.id, ...snap.data() } as Difficulty;
    }
  }

  // Fetch cuisine
  let cuisine: Cuisine | null = null;
  const cuisineId =
    typeof recipe.cuisineId === "string"
      ? recipe.cuisineId
      : recipe.cuisineId?.id;

  if (cuisineId) {
    const snap = await getDoc(doc(db, "cuisines", cuisineId));
    if (snap.exists()) {
      cuisine = { id: snap.id, ...snap.data() } as Cuisine;
    }
  }

  // Fetch categories
  let categories: Category[] = [];
  if (recipe.categories?.length) {
    const categoryIds = recipe.categories.map((cat: Category) =>
      typeof cat === "string" ? cat : cat.id
    );
    categories = await getCategoriesByIds(categoryIds);
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

      {recipe.ingredients?.length > 0 && (
        <div>
          <h2 className="font-semibold mt-4">Ingredients:</h2>
          <ul>
            {recipe.ingredients.map((ing, idx) => (
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

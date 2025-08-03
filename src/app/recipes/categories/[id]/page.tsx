import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/store/firebase/config";
import { RecipeWithID } from "@/types/recipes";
import EntryCard from "@/components/EntryCard";

interface CategoryRecipesPageProps {
  params: { id: string };
}

export default async function CategoryRecipesPage({ params }: CategoryRecipesPageProps) {
  const { id: categoryId } = params;

  // Query recipes where categories array contains this categoryId
  const recipesQuery = query(
    collection(db, "recipes"),
    where("categories", "array-contains", categoryId)
  );

  const querySnapshot = await getDocs(recipesQuery);

  const recipes: RecipeWithID[] = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<RecipeWithID, "id">),
  }));

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recipes in Category</h1>
      {recipes.length === 0 && <p>No recipes found in this category.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <EntryCard key={recipe.id} entry={recipe} />
        ))}
      </div>
    </div>
  );
}

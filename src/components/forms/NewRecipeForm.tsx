"use client";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { saveRecipe } from "@/app/actions/firestoreRecipeActions";
import {
  NewRecipeFormState,
  Cuisine,
  Difficulty,
  Serving,
  Option,
  RecipeWithID,
  Category,
} from "@/types";
import { db, getStaticOptions } from "@/app/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Dropdown from "@/components/Dropdown";
import Textfield from "@/components/Textfield";
import { useUser } from "@/store/UserContext";
import { useRouter } from "next/navigation";

const initialState: NewRecipeFormState = {
  success: false,
  message: "",
};

interface NewRecipeFormProps {
  recipe?: Partial<RecipeWithID>;
  onSubmit?: (formData: FormData) => void;
  onClose?: () => void;
  submitLabel?: string;
}

export default function NewRecipeForm({
  recipe,
  submitLabel = "Save Recipe",
}: NewRecipeFormProps) {
  const router = useRouter();
  const { user } = useUser();
  const [state, action, isPending] = useActionState(saveRecipe, initialState);

  const [selectedCuisine, setSelectedCuisine] = useState<Option | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Option | null>(
    null
  );
  const [selectedServings, setSelectedServings] = useState<Option | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);

  const [cuisines, setCuisines] = useState<Option[]>([]);
  const [difficulties, setDifficulties] = useState<Option[]>([]);
  const [servings, setServings] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [ingredients, setIngredients] = useState(
    recipe?.ingredients?.length
      ? recipe.ingredients
      : [{ strIngredient: "", strMeasure: "" }]
  );

  useEffect(() => {
    async function fetchOptions() {
      const cuisinesData = await getStaticOptions<Cuisine>("cuisines");
      const difficultiesData = await getStaticOptions<Difficulty>(
        "difficulties"
      );
      const servingsData = await getStaticOptions<Serving>("servings");

      setCuisines(cuisinesData.map((c) => ({ id: c.id, name: c.name ?? "" })));
      setDifficulties(
        difficultiesData.map((d) => ({
          id: d.id,
          name: d.avgTime !== undefined ? String(d.avgTime) : "",
        }))
      );
      setServings(servingsData.map((s) => ({ id: s.id, name: s.name ?? "" })));
    }
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      const cats = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, name: data.name };
      });
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (
      cuisines.length > 0 &&
      difficulties.length > 0 &&
      servings.length > 0 &&
      categories.length > 0 &&
      recipe
    ) {
      // For cuisine, difficulty, servings (map type in DB)
      setSelectedCuisine(
        recipe.cuisineId
          ? { id: recipe.cuisineId.id, name: recipe.cuisineId.name ?? "" }
          : null
      );

      setSelectedDifficulty(
        recipe.difficultyId
          ? {
              id: recipe.difficultyId.id,
              name: recipe.difficultyId.name ?? "",
            }
          : null
      );

      setSelectedServings(
        recipe.servingsId
          ? { id: recipe.servingsId.id, name: recipe.servingsId.name ?? "" }
          : null
      );

      if (recipe.categories?.length) {
        setSelectedCategories(
          recipe.categories.map((cat: Category) => ({
            id: cat.id,
            name: cat.name ?? "",
          }))
        );
      } else {
        setSelectedCategories([]);
      }
    }
  }, [cuisines, difficulties, servings, categories, recipe]);

  const updateIngredient = (
    index: number,
    field: "strIngredient" | "strMeasure",
    value: string
  ) => {
    setIngredients((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addIngredient = () => {
    setIngredients((current) => [
      ...current,
      { strIngredient: "", strMeasure: "" },
    ]);
  };

  const removeIngredient = (index: number) => {
    setIngredients((current) => current.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (state.success) {
      router.push("/");
    }
  }, [state.success, router]);

  return (
    <form
      action={action}
      noValidate
      className="text-left max-w-xl mx-auto p-4 space-y-4"
    >
      <Textfield
        label="Recipe Name"
        id="strMeal"
        name="strMeal"
        type="text"
        placeholder="Enter recipe name"
        aria-describedby="strMeal-error"
        defaultValue={recipe?.strMeal || state?.inputs?.strMeal}
        error={state?.errors?.strMeal}
      />
      <Textfield
        label="Instructions"
        id="strInstructions"
        name="strInstructions"
        placeholder="Enter recipe instructions"
        aria-describedby="strInstructions-error"
        defaultValue={recipe?.strInstructions || state?.inputs?.strInstructions}
        error={state?.errors?.strInstructions}
        type="text"
        multiline={true}
      />
      <Textfield
        label="Image URL"
        id="strMealThumb"
        name="strMealThumb"
        placeholder="Enter image URL"
        aria-describedby="strMealThumb-error"
        defaultValue={recipe?.strMealThumb || state?.inputs?.strMealThumb}
        error={state?.errors?.strMealThumb}
        type="url"
      />

      <Dropdown<true>
        label="Categories"
        options={categories}
        selected={selectedCategories}
        setSelected={setSelectedCategories}
        name="categories"
        multiple={true}
      />
      <input
        type="hidden"
        name="categoriesJSON"
        value={JSON.stringify(selectedCategories)}
      />
      <input
        type="hidden"
        name="categoryIdsJSON"
        value={JSON.stringify(selectedCategories.map((c) => c.id))}
      />
      <Dropdown
        label="Cuisine"
        name="cuisine"
        options={cuisines}
        selected={selectedCuisine}
        setSelected={setSelectedCuisine}
        multiple={false}
      />
      <input
        type="hidden"
        name="cuisineJSON"
        value={JSON.stringify(selectedCuisine)}
      />

      <Dropdown
        label="Cooking Time (minutes)"
        name="difficulty"
        options={difficulties}
        selected={selectedDifficulty}
        setSelected={setSelectedDifficulty}
        multiple={false}
      />
      <input
        type="hidden"
        name="difficultyJSON"
        value={JSON.stringify(selectedDifficulty)}
      />
      <Dropdown
        label="Serving Size"
        name="servings"
        options={servings}
        selected={selectedServings}
        setSelected={setSelectedServings}
        multiple={false}
      />

      <input
        type="hidden"
        name="servingsJSON"
        value={JSON.stringify(selectedServings)}
      />

      <div>
        <label className="font-medium mb-2 block">Ingredients</label>
        {ingredients.map((ing, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Ingredient"
              value={ing.strIngredient}
              onChange={(e) =>
                updateIngredient(i, "strIngredient", e.target.value)
              }
              className="border rounded px-2 py-1 flex-grow"
              name={`ingredients[${i}][strIngredient]`}
            />
            <label
              className="sr-only"
              htmlFor={`ingredients[${i}][strMeasure]`}
            >
              Measure
            </label>
            <input
              type="text"
              placeholder="e.g., 1 cup"
              value={ing.strMeasure}
              onChange={(e) =>
                updateIngredient(i, "strMeasure", e.target.value)
              }
              className="border rounded px-2 py-1 w-24"
              name={`ingredients[${i}][strMeasure]`}
            />
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredient(i)}
                className="text-gray-300 font-bold px-2 cursor-pointer hover:animate-pulse hover:scale-200 transition-transform duration-200"
                aria-label="Remove ingredient"
              >
                -
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addIngredient}
          className="mt-2 text-sm bg-gray-600 text-white px-3 py-1 rounded cursor-pointer"
        >
          +
        </button>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Publish as:</label>
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            name="isAnonymous"
            value="false"
            defaultChecked={recipe?.isAnonymous}
          />
          <span>Post Anonymously</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Visibility:</label>
        <select
          name="visibility"
          className="w-full border p-2 rounded bg-black"
          defaultValue={recipe?.visibility || "public"}
        >
          <option value="public">Public (show in feed + profile)</option>
          <option value="private">Private (only on your profile)</option>
        </select>
      </div>

      <input type="hidden" name="authorName" value={user?.name || "Unknown"} />
      <input type="hidden" name="authorId" value={user?.id || ""} />
      {recipe?.id && <input type="hidden" name="id" value={recipe.id} />}

      <button
        type="submit"
        className="mt-4 bg-red-400 text-white px-4 py-2 rounded-3xl"
        disabled={isPending}
      >
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

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
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";

const initialState: NewRecipeFormState = {
  success: false,
  message: "",
};

interface NewRecipeFormProps {
  recipe?: Partial<RecipeWithID>;
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

  const hiddenFields = [
    { name: "cuisineJSON", value: selectedCuisine },
    { name: "difficultyJSON", value: selectedDifficulty },
    { name: "servingsJSON", value: selectedServings },
    { name: "categoriesJSON", value: selectedCategories },
    { name: "categoryIdsJSON", value: selectedCategories.map((c) => c.id) },
  ];

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

      <Dropdown
        label="Cuisine"
        name="cuisine"
        options={cuisines}
        selected={selectedCuisine}
        setSelected={setSelectedCuisine}
        multiple={false}
      />

      <Dropdown
        label="Cooking Time (minutes)"
        name="difficulty"
        options={difficulties}
        selected={selectedDifficulty}
        setSelected={setSelectedDifficulty}
        multiple={false}
      />

      <Dropdown
        label="Serving Size"
        name="servings"
        options={servings}
        selected={selectedServings}
        setSelected={setSelectedServings}
        multiple={false}
      />

      <div>
        <label className="mb-2 block text-orange-700 font-semibold">
          Ingredients
        </label>
        {ingredients.map((ing, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-2 mb-2">
            <input
              type="text"
              placeholder="Ingredient"
              value={ing.strIngredient}
              onChange={(e) =>
                updateIngredient(i, "strIngredient", e.target.value)
              }
              className="border border-orange-300 p-2 rounded bg-white w-full text-left text-gray-900 min-h-[42px] flex flex-wrap gap-2 hover:ring-2 hover:ring-orange-400 transition focus:outline-orange-400"
              name={`ingredients[${i}][strIngredient]`}
            />
            <input
              type="text"
              placeholder="e.g., 1 cup"
              value={ing.strMeasure}
              onChange={(e) =>
                updateIngredient(i, "strMeasure", e.target.value)
              }
              className="border border-orange-300 p-2 rounded bg-white w-full text-left text-gray-900 min-h-[42px] flex flex-wrap gap-2 hover:ring-2 hover:ring-orange-400 transition max-w-1/5 focus:outline-orange-400"
              name={`ingredients[${i}][strMeasure]`}
            />
            {ingredients.length > 1 && (
              <SecondaryButton
                type="button"
                onClick={() => removeIngredient(i)}
                aria-label="Remove ingredient"
              >
                &minus;
              </SecondaryButton>
            )}
          </div>
        ))}

        <PrimaryButton type="button" onClick={addIngredient}>
          + Add
        </PrimaryButton>
      </div>
      {hiddenFields.map(({ name, value }) => (
        <input
          key={name}
          type="hidden"
          name={name}
          value={JSON.stringify(value)}
        />
      ))}
      <div className="mb-4">
        <label className="mb-2 block text-orange-700 font-semibold">
          Publish as:
        </label>
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            name="isAnonymous"
            value="true"
            defaultChecked={recipe?.isAnonymous}
          />
          <span className="text-black">Post Anonymously</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-orange-700 font-semibold">
          Visibility:
        </label>
        <select
          name="visibility"
          className="w-full border border-orange-300 rounded px-3 py-2 bg-white text-gray-800"
          defaultValue={recipe?.visibility || "public"}
        >
          <option value="public">Public (show in feed + profile)</option>
          <option value="private">Private (only on your profile)</option>
        </select>
      </div>

      <input type="hidden" name="authorName" value={user?.name || "Unknown"} />
      <input type="hidden" name="authorId" value={user?.id || ""} />
      {recipe?.id && <input type="hidden" name="id" value={recipe.id} />}

      <PrimaryButton type="submit" disabled={isPending}>
        {isPending ? "Saving..." : submitLabel}
      </PrimaryButton>
    </form>
  );
}

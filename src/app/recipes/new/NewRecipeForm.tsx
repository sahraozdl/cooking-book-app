"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { saveRecipe } from "@/app/actions/recipes";
import {
  NewRecipeFormState,
  Cuisine,
  Difficulty,
  Option,
} from "@/types/recipes";
import { db, getStaticOptions } from "@/store/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Dropdown from "@/components/Dropdown";
import Textfield from "@/components/Textfield";
import { useUser } from "@/components/UserContext";

const initialState: NewRecipeFormState = {
  success: false,
  message: "",
};

export const servingsOptions = [
  { id: "1", name: "1-2" },
  { id: "2", name: "3-4 " },
  { id: "3", name: "5-8" },
  { id: "4", name: "8-12" },
  { id: "5", name: "12+" },
];

export default function NewRecipeForm() {
  const { user } = useUser();
  const [state, action, isPending] = useActionState(saveRecipe, initialState);

  const [selectedDifficulty, setSelectedDifficulty] = useState<Option | null>(
    null
  );
  const [selectedCuisine, setSelectedCuisine] = useState<Option | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);

  const [cuisines, setCuisines] = useState<Option[]>([]);
  const [difficulties, setDifficulties] = useState<Option[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Option[]>([]);

  const [ingredients, setIngredients] = useState<
    { strIngredient: string; strMeasure: string }[]
  >([{ strIngredient: "", strMeasure: "" }]);

  const [selectedServings, setSelectedServings] = useState<Option | null>(null);

  useEffect(() => {
    async function fetchOptions() {
      const cuisines = await getStaticOptions<Cuisine>("cuisines");
      const difficulties = await getStaticOptions<Difficulty>("difficulties");

      setCuisines(
        cuisines.map((c: Cuisine) => ({
          id: c.id,
          name: c.name,
          region: c.region,
        }))
      );

      setDifficulties(
        difficulties.map((d: Difficulty) => ({
          id: d.id,
          name: d.avgTime,
        }))
      );
    }

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      const cats = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.strCategory,
        };
      });
      setAvailableCategories(cats);
    };

    fetchCategories();
  }, []);

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
        defaultValue={state?.inputs?.strMeal}
        error={state?.errors?.strMeal}
      />
      <Textfield
        label="Instructions"
        id="strInstructions"
        name="strInstructions"
        placeholder="Enter recipe instructions"
        aria-describedby="strInstructions-error"
        defaultValue={state?.inputs?.strInstructions}
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
        defaultValue={state?.inputs?.strMealThumb}
        error={state?.errors?.strMealThumb}
        type="url"
      />

      <Dropdown<true>
        label="Categories"
        options={availableCategories}
        selected={selectedCategories}
        setSelected={setSelectedCategories}
        name="categories"
        multiple={true}
      />
      <input
        type="hidden"
        name="categoriesJSON"
        value={JSON.stringify(selectedCategories.map((c) => c.id))}
      />
      <Dropdown
        label="Cuisine"
        options={cuisines}
        selected={selectedCuisine}
        setSelected={setSelectedCuisine}
        name="cuisine"
      />
      <input
        type="hidden"
        name="cuisineId"
        value={selectedCuisine?.id || ""}
      />

      <Dropdown
        label="Cooking Time (minutes)"
        options={difficulties}
        selected={selectedDifficulty}
        setSelected={setSelectedDifficulty}
        name="difficulty"
      />
      <input
        type="hidden"
        name="difficultyId"
        value={selectedDifficulty?.id || ""}
      />
      <Dropdown
        label="Serving Size"
        name="servings"
        options={servingsOptions}
        selected={selectedServings}
        setSelected={setSelectedServings}
        multiple={false}
      />

      <input
        type="hidden"
        name="servingsId"
        value={selectedServings?.id || ""}
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
              name={`strIngredient[${i}][strMeasure]`}
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
          <input type="checkbox" name="isAnonymous" value="true" />
          <span>Post Anonymously</span>
        </label>
      </div>

      {/* Visibility selector */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Visibility:</label>
        <select
          name="visibility"
          className="w-full border p-2 rounded bg-black"
        >
          <option value="public">Public (show in feed + profile)</option>
          <option value="private">Private (only on your profile)</option>
        </select>
      </div>

      {/* ✅ Safe usage of user data */}
      <input type="hidden" name="authorName" value={user?.name || "Unknown"} />
      <input type="hidden" name="authorId" value={user?.id || ""} />

      <button
        type="submit"
        className="mt-4 bg-red-400 text-white px-4 py-2 rounded-3xl"
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save Recipe"}
      </button>
    </form>
  );
}

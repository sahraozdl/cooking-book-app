import { addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, recipesCollectionRef } from '@/app/lib/firebase/config';
import { recipeSchema } from './schema';
import { UserTypes, NewRecipeFormState, RecipeSchemaType } from '@/types';

function safeJSONParse<T>(value: FormDataEntryValue | null, fallback: T): T {
  try {
    if (!value) return fallback;
    return JSON.parse(value as string) as T;
  } catch (err) {
    console.warn('Failed to parse JSON value:', value, err);
    return fallback;
  }
}
export async function saveRecipe(
  prevState: NewRecipeFormState | null,
  formData: FormData
): Promise<NewRecipeFormState> {
  const recipeId = formData.get('id') as string | null;

  try {
    const ingredients: { strIngredient: string; strMeasure: string }[] = [];
    for (const [key, value] of formData.entries()) {
      const match = key.match(/^ingredients\[(\d+)\]\[(strIngredient|strMeasure)\]$/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2] as 'strIngredient' | 'strMeasure';
        if (!ingredients[index]) ingredients[index] = { strIngredient: '', strMeasure: '' };
        ingredients[index][field] = value as string;
      }
    }

    const filteredIngredients = ingredients.filter(
      (ing) => ing.strIngredient.trim() || ing.strMeasure.trim()
    );

    const rawData: RecipeSchemaType = {
      strMeal: formData.get('strMeal') as string,
      strInstructions: formData.get('strInstructions') as string,
      strMealThumb: formData.get('strMealThumb') as string,
      categories: safeJSONParse(formData.get('categoriesJSON'), []),
      categoryIds: safeJSONParse(formData.get('categoryIdsJSON'), []),
      cuisineId: safeJSONParse(formData.get('cuisineJSON'), { id: '', name: '' }),
      difficultyId: safeJSONParse(formData.get('difficultyJSON'), { id: '', name: '' }),
      servingsId: safeJSONParse(formData.get('servingsJSON'), { id: '', name: '' }),
      ingredients: filteredIngredients,
      isAnonymous: formData.get('isAnonymous') === 'true',
      visibility: (formData.get('visibility') as 'public' | 'private') || 'private',
      authorName: (formData.get('authorName') as string) || 'Unknown',
      authorId: formData.get('authorId') as string,
      likedBy: [],
      savedBy: [],
      likeCount: 0,
      saveCount: 0,
    };

    const validateData = recipeSchema.safeParse(rawData);
    if (!validateData.success) {
      console.warn('[saveRecipe] Validation failed', validateData.error.flatten().fieldErrors);
      return {
        success: false,
        message: 'Validation failed. Please check your input.',
        errors: validateData.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    const validData = validateData.data;

    if (recipeId) {
      const recipeRef = doc(db, 'recipes', recipeId);
      const recipeSnap = await getDoc(recipeRef);

      if (!recipeSnap.exists()) {
        console.warn('[saveRecipe] Recipe not found with ID:', recipeId);
        return {
          success: false,
          message: 'Recipe not found.',
          inputs: rawData,
        };
      }

      await updateDoc(recipeRef, {
        ...validData,
        updatedAt: serverTimestamp(),
      });

      return {
        success: true,
        message: `Recipe with ID ${recipeId} updated successfully!`,
        inputs: { ...validData, id: recipeId },
      };
    }

    const docRef = await addDoc(recipesCollectionRef, {
      ...validData,
      createdAt: serverTimestamp(),
    });

    const newRecipeId = docRef.id;

    if (validData.authorId) {
      const userRef = doc(db, 'users', validData.authorId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.warn('[saveRecipe] User not found:', validData.authorId);
      } else {
        const userData = userSnap.data() as UserTypes;
        const updatedWrites = [...(userData?.writes || []), newRecipeId];

        await updateDoc(userRef, {
          writes: updatedWrites,
          writesCount: updatedWrites.length,
        });
      }
    }

    return {
      success: true,
      message: `Recipe with ID ${newRecipeId} saved successfully!`,
      inputs: validData,
    };
  } catch (error) {
    console.error('Error saving recipe:', error);
    return {
      success: false,
      message: 'Failed to save recipe. Please try again.',
      inputs: prevState?.inputs,
    };
  }
}

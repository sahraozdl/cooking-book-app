"use client";

import Form  from "next/form";
import { useActionState } from "react";
import { saveRecipe } from "@/app/actions/recipes";
import {Field, Input, Label, Textarea} from "@headlessui/react";
import { InitialState } from "@/types/recipes";

const initialState: InitialState = {
  success: false,
  message: "",
};
 const NewRecipeForm = () => {
  const [state, action, isPending] = useActionState(saveRecipe, initialState);
  return (
      <Form action={action} noValidate className="text-left">
        <Field className="flex flex-col my-4">
          <Label htmlFor="strMeal">Recipe Name</Label>
          <Input
            id="strMeal"
            name="strMeal"
            type="text"
            placeholder="Enter recipe name"
            className="dark:border-gray-100 border border-rounded p-2"
            required/>
        </Field>
        <Field className="flex flex-col my-4">
          <Label htmlFor="strInstructions">Instructions</Label>
          <Textarea
            id="strInstructions"
            name="strInstructions"
            placeholder="Enter recipe instructions"
            className="dark:border-gray-100 border border-rounded p-2"
            required/>
        </Field>
        <Field className="flex flex-col my-4">
          <Label htmlFor="strMealThumb">URL for the Image</Label>
          <Input
            id="strMealThumb"
            name="strMealThumb"
            placeholder="Enter URL for the Image"
            className="dark:border-gray-100 border border-rounded p-2"
            required/>
        </Field>
        <button  type="submit" >Save Recipe</button>
      </Form>
  )
}
export default NewRecipeForm;
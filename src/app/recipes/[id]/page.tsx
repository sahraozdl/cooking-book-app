import Image from "next/image";
export default async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const recipe = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const recipeData= await recipe.json();

  return <div>Current recipe id is: {id}
  <h1>{recipeData.meals[0].strMeal}</h1>
  <Image src={recipeData.meals[0].strMealThumb} alt={recipeData.meals[0].strMeal}
  width={300}
  height={300}/>
  <p>{recipeData.meals[0].strInstructions}</p>
  </div>
}
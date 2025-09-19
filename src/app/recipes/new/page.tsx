import NewRecipeForm from '../../../components/forms/NewRecipeForm';

const NewRecipePage = () => {
  return (
    <div className="text-center my-8 max-w-6xl mx-auto">
      <h1 className="text-2xl mb-4 text-orange-800 font-bold">Create New Recipe</h1>
      <NewRecipeForm />
    </div>
  );
};

export default NewRecipePage;

import Link from "next/link";
export const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl">Cooking Book App</h1>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-white hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/recipes/new" className="text-white hover:underline">
              New Recipe
            </Link>
          </li>
          <li>
            <Link href="/recipes/categories" className="text-white hover:underline">
              Categories
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
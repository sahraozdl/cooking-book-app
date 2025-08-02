import Link from "next/link";
import ProtectedRoute from "./ProtectedRoute";
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
            <ProtectedRoute>
            <Link href="/recipes/new" className="text-white hover:underline">
              New Recipe
            </Link>
            </ProtectedRoute>
          </li>
          <li>
            <Link href="/recipes/categories" className="text-white hover:underline">
              Categories
            </Link>
          </li>
          <li>
            <Link href="/login" className="text-white hover:underline">
              Login
            </Link>
          </li>
           <li>
            <ProtectedRoute>
            <Link href="/profile" className="text-white hover:underline">
              Profile
            </Link>
            </ProtectedRoute>
          </li>
        </ul>
      </div>
    </nav>
  );
}
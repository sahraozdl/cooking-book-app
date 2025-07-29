"use client";
import Link from "next/link";
import Image from "next/image";
import {useEffect, useState} from "react";
export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories(){
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      const data = await response.json();
      setCategories(data.categories);
    };

    fetchCategories();
  }, []);

  
  return (
    <div className="text-center my-8">
      <h1>Categories Page</h1>
      <p>Choose a category</p>

      <ul className="max-w-6xl mx-auto flex flex-wrap gap-6 justify-between">
        {categories &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          categories.map((category: any ) => {
            return (
              <li key={category.idCategory} className="max-w-3xs my-4">
                <Link href={`/recipes/categories/${category.strCategory}`}>
                  <h2>{category.strCategory}</h2>
                  <Image
                    src={category.strCategoryThumb}
                    alt={category.strCategory}
                    width={300}
                    height={300}
                  />
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

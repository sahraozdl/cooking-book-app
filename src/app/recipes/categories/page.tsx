"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase/config";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types";
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategoriesFromFirestore() {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoryList: Category[] = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as Category[];

        categoryList.sort((a, b) => Number(a.id) - Number(b.id));

        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategoriesFromFirestore();
  }, []);

  return (
    <div className="text-center my-8 text-gray-800">
      <h1>Categories Page</h1>
      <p>Choose a category</p>

      <ul className="max-w-6xl mx-auto flex flex-wrap gap-6 justify-between">
        {categories &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          categories.map((category: any) => {
            return (
              <li key={category.id} className="max-w-3xs my-4">
                <Link href={`/recipes/categories/${category.id}`}>
                  <h2>{category.name}</h2>
                  <Image
                    src={category.strCategoryThumb}
                    alt={category.name}
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

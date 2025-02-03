"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Photo, Category } from "@/app/utils/interfaces";

export const Polaroid = () => {
  const [images, setImages] = useState<Photo[]>();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imagesResponse, categoriesResponse] = await Promise.all([
          fetch("http://localhost:3000/photos/photos", {
            headers: { Accept: "application/json" },
          }),
          fetch("http://localhost:3000/categories", {
            headers: { Accept: "application/json" },
          }),
        ]);

        if (!imagesResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [imagesData, categoriesData] = await Promise.all([
          imagesResponse.json(),
          categoriesResponse.json(),
        ]);

        setImages(imagesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = async (categoryId: string) => {
    try {
      let url = "http://localhost:3000/photos/photos";
      if (categoryId !== "all") {
        url = `http://localhost:3000/photos_categories/category/${categoryId}`;
      }

      const response = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }

      const data = await response.json();
      setImages(data);
      setSelectedCategory(categoryId);
    } catch (error) {
      console.error("Error filtering photos:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-end px-8 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="block w-48 bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap justify-around gap-[30px] mt-5 mx-2 md:mx-8">
        {images?.map((image) => (
          <div
            key={image.id}
            className="
        p-[15px] pb-[60px] 
        shadow-[5px_15px_15px_rgb(225,225,225)] 
        h-full relative
        hover:shadow-[-5px_15px_15px_rgb(225,225,225)] 
        hover:scale-[1.1] 
        transition-all duration-500 
        after:content-[attr(polaroid-caption)] 
        after:absolute after:bottom-0 after:left-0 
        after:w-full after:text-center 
        after:p-[10px] after:text-[30px]
        after:transition-all after:opacity-50 
        after:hover:opacity-100 after:duration-1000
        mx-auto
        border border-1 border-gray-100
        "
            polaroid-caption={image.name}
          >
            <Link href={`/photo/${image.id}`}>
              <Image
                src={image.path}
                width={0}
                height={0}
                alt={image.name}
                sizes="100vw"
                className="max-w-[250px] min-w-[250px] w-auto h-auto opacity-50 hover:opacity-100 transition-all duration-500 mx-auto"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

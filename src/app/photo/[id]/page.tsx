"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Likes } from "@/app/components/Likes";
import { Comments } from "@/app/components/Comments";
import DownloadButton from "@/app/components/DownloadButton";
import { Photo, Category, User } from "@/app/utils/interfaces";
import UserTooltip from "@/app/components/UserTooltip";

export default function PhotoPage() {
  const [photo, setPhoto] = useState<Photo>({
    id: "",
    user_id: "",
    name: "",
    description: "",
    path: "",
    status: false,
    user: {
      username: "",
      email: "",
      id: "",
      user_icon: "",
    },
  });
  const [category, setCategory] = useState<Category | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const pathname = usePathname();
  const id = pathname?.split("/").pop();

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (!id) return;

      try {
        // Fetch both photo and category data in parallel
        const [photoResponse, categoryResponse] = await Promise.all([
          fetch(`http://localhost:3000/photos/photo/${id}`, {
            headers: {
              Accept: "application/json",
            },
          }),
          fetch(`http://localhost:3000/photos_categories/photo/${id}`, {
            headers: {
              Accept: "application/json",
            },
          }),
        ]);

        if (!photoResponse.ok) {
          throw new Error(`HTTP error status: ${photoResponse.status}`);
        }

        const photoData = await photoResponse.json();
        setPhoto(photoData);

        const fetchUser = async () => {
          const userResponse = await fetch(
            `http://localhost:3000/user/user/${photoData.user_id}`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!userResponse.ok) {
            throw new Error(`HTTP error status: ${userResponse.status}`);
          }

          const userData = await userResponse.json();
          return userData;
        };

        const userRes = await fetchUser();
        if (userRes && userRes.length > 0) {
          photoData.user = userRes[0];
          setUser(userRes[0]);
        }

        // Handle category data if it exists
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          if (categoryData && categoryData.length > 0) {
            setCategory(categoryData[0]);
          }
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch photo."
        );
      } finally {
        setLoading(false);
      }
    };

    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const tokenExpires = localStorage.getItem("tokenExpires");
      const isAuthenticated =
        isLoggedIn && tokenExpires && Number(tokenExpires) > Date.now();

      setIsAuthenticated(Boolean(isAuthenticated));
    };

    checkAuth();

    fetchPhoto();
  }, [id]);

  if (loading) {
    return <div className="mt-[5rem] text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="mt-[5rem] text-center">
        <p>{error}</p>
      </div>
    );
  }

  if (!photo) {
    return <div className="mt-[5rem] text-center">No photo found</div>;
  }

  const handleDownload = async () => {
    try {
      // If user is authenticated, track the download
      if (isAuthenticated) {
        try {
          const response = await fetch(
            `http://localhost:3000/downloads/download/${photo.id}`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            console.error("Failed to track download");
          }
        } catch (error) {
          console.error("Error tracking download:", error);
          // Continue with download even if tracking fails
        }
      }

      // Proceed with download regardless of authentication status
      const response = await fetch(photo.path);
      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      // Get file extension from path or default to .jpg
      const extension = photo.path.split(".").pop() || "jpg";
      link.download = `${photo.name}.${extension}`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return photo.status ? (
    <>
      <div className="mt-[5rem] min-h-screen md:min-h-0 mx-auto">
        <div
          className="
          border-solid
          p-[15px] pb-[60px] 
          shadow-[5px_15px_15px_rgb(225,225,225)] 
          h-full relative
          hover:shadow-[-5px_15px_15px_rgb(225,225,225)] 
          transition-all duration-500
          after:content-[attr(polaroid-caption)] 
          after:absolute after:bottom-0 after:left-0 
          after:w-full after:text-center 
          after:p-[10px] after:text-[30px]
          border border-1 border-gray-100
        "
          polaroid-caption={photo.name}
        >
          <Image
            src={photo.path}
            alt={photo.name}
            sizes="100vw"
            width={0}
            height={0}
            quality={100}
            className="w-full h-auto object-scale-down max-w-[80vw] max-h-[80vh] mx-auto"
            unoptimized
          />
        </div>
        {/* Display user information */}
        {user && (
          <div className="mt-8 text-gray-600">
            Created by{" "}
            <UserTooltip
              username={user.username}
              email={user.email}
              className="font-medium"
            />
          </div>
        )}
        <div className="mt-8 flex justify-between">
          <Likes photo_id={photo.id} />
          <DownloadButton onClick={handleDownload} />
        </div>

        {/* Add category display here */}
        {category && (
          <div className="mt-8">
            <span className="text-gray-600">Category: </span>
            <span className="font-medium">{category.name}</span>
          </div>
        )}
        <div className="mt-8">{photo.description}</div>

        <div className="mt-8">
          <Comments photo_id={photo.id} />
        </div>
      </div>
    </>
  ) : (
    <div className="mt-[5rem] text-center">
      <p>This photo has been made private.</p>
    </div>
  );
}
